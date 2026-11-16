import os
from logging.config import fileConfig

from alembic import context
from sqlalchemy import create_engine

from app.core.config import settings
from app.core.database import DATABASE_URL, Base
from app.modules.auth import models as auth_models  # noqa: F401
from app.modules.inventory import models as inventory_models  # noqa: F401
from app.modules.users import models as users_models  # noqa: F401

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata


def get_database_url():
    database_name = os.getenv("ALEMBIC_DB_NAME", settings.db_name)

    return DATABASE_URL.set(database=database_name)


def run_migrations_offline() -> None:
    """Run migrations without creating a database connection."""
    context.configure(
        url=get_database_url().render_as_string(hide_password=False),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations using the configured database."""
    migration_engine = create_engine(
        get_database_url(),
        pool_pre_ping=True,
    )

    try:
        with migration_engine.connect() as connection:
            context.configure(
                connection=connection,
                target_metadata=target_metadata,
                compare_type=True,
            )

            with context.begin_transaction():
                context.run_migrations()
    finally:
        migration_engine.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
