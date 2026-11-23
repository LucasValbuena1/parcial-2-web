import { Logger, type INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';

// =====================================================================
// REVISIÓN DE TABLAS AL ARRANCAR (para saber que synchronize funcionó)
// =====================================================================
// Cada vez que arranca Nest, imprime en la consola:
//   - las tablas que hay en la base
//   - si a alguna ENTIDAD le falta su tabla
//
// Así se ve en la consola cuando todo está bien:
//   [Tablas] OK: cada entidad tiene su tabla -> roles, users, users_roles
//
// Si agregas una entidad nueva (ej. Product) y NO aparece en esa lista,
// casi siempre es porque falta registrarla en su módulo:
//   imports: [TypeOrmModule.forFeature([Product])]
// Sin eso, TypeORM no la conoce y no le crea tabla.
// =====================================================================
export async function revisarTablas(app: INestApplication) {
  const logger = new Logger('Tablas');
  const dataSource = app.get(DataSource);

  // Tablas que TypeORM espera, según las entidades registradas con forFeature
  const esperadas = dataSource.entityMetadatas.map((meta) => meta.tableName).sort();

  // Tablas que existen de verdad en la base
  const filas: { table_name: string }[] = await dataSource.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
  );
  const enLaBase = filas.map((fila) => fila.table_name);

  const faltantes = esperadas.filter((tabla) => !enLaBase.includes(tabla));
  if (faltantes.length === 0) {
    logger.log(`OK: cada entidad tiene su tabla -> ${esperadas.join(', ')}`);
  } else {
    logger.error(`Entidades SIN tabla en la base: ${faltantes.join(', ')}`);
  }
}
