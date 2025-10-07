import 'dotenv/config';
import { Sequelize } from "sequelize";
declare const sequelize: Sequelize;
declare function connectWithRetry(attempts?: number, delay?: number): Promise<true | undefined>;
export { sequelize, connectWithRetry };
//# sourceMappingURL=database.d.ts.map