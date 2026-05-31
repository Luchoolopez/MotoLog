import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LicenseInsuranceService, type LicenseInsurance } from '../services/licenseInsurance.service';
import { FineService } from '../services/fine.service';
import { MotoService } from '../services/moto.service';
import { AlertReminderService } from '../services/alertReminder.service';
import type { Fine } from '../types/fine.types';
import type { MaintenanceStatus, Motorcycle } from '../types/moto.types';

interface DashboardAlertsProps {
    motos: Motorcycle[];
}

type AlertTone = 'danger' | 'warning';

interface AlertItem {
    key: string;
    tone: AlertTone;
    title: string;
    detail: string;
    link: string;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const daysUntil = (value: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(value);
    target.setHours(0, 0, 0, 0);
    return Math.ceil((target.getTime() - today.getTime()) / MS_PER_DAY);
};

const formatDueText = (days: number) => {
    if (days < 0) return `Vencido hace ${Math.abs(days)} dia${Math.abs(days) === 1 ? '' : 's'}`;
    if (days === 0) return 'Vence hoy';
    return `Vence en ${days} dia${days === 1 ? '' : 's'}`;
};

const toneClass: Record<AlertTone, string> = {
    danger: 'border-danger bg-danger bg-opacity-10',
    warning: 'border-warning bg-warning bg-opacity-10'
};

export const DashboardAlerts = ({ motos }: DashboardAlertsProps) => {
    const [maintenance, setMaintenance] = useState<Array<MaintenanceStatus & { moto: Motorcycle }>>([]);
    const [docs, setDocs] = useState<LicenseInsurance[]>([]);
    const [fines, setFines] = useState<Fine[]>([]);
    const [loading, setLoading] = useState(false);
    const [snoozedAlerts, setSnoozedAlerts] = useState<Record<string, string>>({});

    useEffect(() => {
        let active = true;

        const loadAlerts = async () => {
            if (!motos.length) {
                setMaintenance([]);
                setDocs([]);
                setFines([]);
                return;
            }

            setLoading(true);
            try {
                const [statusResults, docsResult, fineResults, reminderResults] = await Promise.all([
                    Promise.allSettled(motos.map(async (moto) => {
                        const status = await MotoService.getStatus(moto.id);
                        return status.map(item => ({ ...item, moto }));
                    })),
                    LicenseInsuranceService.getAll(),
                    Promise.allSettled(motos.map(moto => FineService.getAllByMoto(moto.id))),
                    AlertReminderService.getActive()
                ]);

                if (!active) return;

                setMaintenance(statusResults.flatMap(result => result.status === 'fulfilled' ? result.value : []));
                setDocs(docsResult);
                setFines(fineResults.flatMap(result => result.status === 'fulfilled' ? result.value : []));
                setSnoozedAlerts(Object.fromEntries(
                    reminderResults.map(reminder => [reminder.alert_key, reminder.snoozed_until])
                ));
            } catch (error) {
                console.error('Error cargando alertas:', error);
            } finally {
                if (active) setLoading(false);
            }
        };

        loadAlerts();

        return () => {
            active = false;
        };
    }, [motos]);

    const alerts = useMemo<AlertItem[]>(() => {
        const maintenanceAlerts = maintenance
            .filter(item => item.estado !== 'OK')
            .map(item => ({
                key: `maintenance-${item.moto.id}-${item.item_id}`,
                tone: item.estado === 'VENCIDO' ? 'danger' as const : 'warning' as const,
                title: `${item.tarea} - ${item.moto.modelo}`,
                detail: item.estado === 'VENCIDO'
                    ? (item.km_restantes < 0 ? `Pasado por ${Math.abs(item.km_restantes)} km` : formatDueText(item.dias_restantes))
                    : (item.intervalo_km > 0 ? `Faltan ${item.km_restantes} km` : formatDueText(item.dias_restantes)),
                link: `/motos/${item.moto.id}`
            }));

        const docAlerts = docs
            .map(doc => ({ doc, days: daysUntil(doc.fecha_vencimiento) }))
            .filter(({ days }) => days <= 30)
            .map(({ doc, days }) => ({
                key: `doc-${doc.id}`,
                tone: days < 0 ? 'danger' as const : 'warning' as const,
                title: `${doc.tipo} - ${doc.moto?.modelo || 'Moto'}`,
                detail: `${formatDueText(days)}${doc.pagado ? '' : ' - pendiente'}`,
                link: doc.tipo === 'Seguro' ? '/management/seguros' : doc.tipo === 'VTV' ? '/management/vtv' : '/management/patentes'
            }));

        const fineAlerts = fines
            .filter(fine => fine.status === 'Pendiente' || fine.status === 'Apelado')
            .map(fine => ({
                key: `fine-${fine.id}`,
                tone: fine.status === 'Pendiente' ? 'danger' as const : 'warning' as const,
                title: `${fine.type}: ${fine.description}`,
                detail: `${fine.status} - $${Number(fine.amount).toLocaleString('es-AR')}`,
                link: '/management/fines'
            }));

        return [...maintenanceAlerts, ...docAlerts, ...fineAlerts].slice(0, 8);
    }, [docs, fines, maintenance]);

    const visibleAlerts = useMemo(() => {
        const now = new Date();
        return alerts.filter(alert => {
            const expiresAt = snoozedAlerts[alert.key];
            return !expiresAt || new Date(expiresAt) <= now;
        });
    }, [alerts, snoozedAlerts]);

    const counts = useMemo(() => ({
        danger: visibleAlerts.filter(alert => alert.tone === 'danger').length,
        warning: visibleAlerts.filter(alert => alert.tone === 'warning').length
    }), [visibleAlerts]);

    const snoozedCount = alerts.length - visibleAlerts.length;

    const snoozeAlert = async (key: string) => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(8, 0, 0, 0);

        const snoozedUntil = tomorrow.toISOString();
        setSnoozedAlerts(prev => ({ ...prev, [key]: snoozedUntil }));

        try {
            await AlertReminderService.snooze(key, snoozedUntil);
        } catch (error) {
            console.error('Error posponiendo alerta:', error);
            setSnoozedAlerts(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const restoreSnoozedAlerts = async () => {
        const previous = snoozedAlerts;
        setSnoozedAlerts({});

        try {
            await AlertReminderService.clearAll();
        } catch (error) {
            console.error('Error restaurando alertas:', error);
            setSnoozedAlerts(previous);
        }
    };

    if (!motos.length) return null;

    return (
        <section className="mb-4">
            <div className="rounded shadow-lg border border-secondary" style={{ backgroundColor: 'rgba(23, 23, 23, 0.94)' }}>
                <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 p-3 border-bottom border-secondary">
                    <div>
                        <h2 className="h5 mb-1 fw-bold">Panel de alertas</h2>
                        <p className="mb-0 text-white-50 small">
                            {loading ? 'Actualizando estado...' : visibleAlerts.length ? 'Pendientes importantes de tus motos' : 'Todo al dia por ahora'}
                        </p>
                    </div>
                    <div className="d-flex gap-2 flex-wrap">
                        <span className="badge bg-danger px-3 py-2">{counts.danger} urgentes</span>
                        <span className="badge bg-warning text-dark px-3 py-2">{counts.warning} proximas</span>
                    </div>
                </div>

                {visibleAlerts.length === 0 ? (
                    <div className="p-3 text-white-50">
                        No hay vencimientos cercanos, servicios vencidos ni multas pendientes.
                        {snoozedCount > 0 && (
                            <button
                                type="button"
                                className="btn btn-sm btn-outline-light ms-2"
                                onClick={restoreSnoozedAlerts}
                            >
                                Ver pospuestas
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="row g-2 p-3">
                        {visibleAlerts.map(alert => (
                            <div className="col-12 col-md-6 col-xl-3" key={alert.key}>
                                <div className={`h-100 rounded border-start border-4 p-3 ${toneClass[alert.tone]}`}>
                                    <Link to={alert.link} className="d-block text-white text-decoration-none">
                                        <div className="fw-bold text-truncate" title={alert.title}>{alert.title}</div>
                                        <div className="small text-white-50 mt-1">{alert.detail}</div>
                                    </Link>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-light w-100 mt-3"
                                        onClick={() => snoozeAlert(alert.key)}
                                    >
                                        Recordar manana
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
