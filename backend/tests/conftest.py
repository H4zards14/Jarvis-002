
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import URL, create_engine
from sqlalchemy.orm import sessionmaker

import app.modules.auth.models  # noqa: F401
import app.modules.inventory.models  # noqa: F401
import app.modules.users.models  # noqa: F401
from app.core.config import settings
from app.core.database import Base
from app.main import app
from app.modules.auth.dependencies import get_auth_db

TEST_DATABASE_NAME = "Jarvis002_test"


@pytest.fixture(scope="session")
def test_engine():
    if settings.db_name == TEST_DATABASE_NAME:
        raise RuntimeError(
            "The configured application database must not be the test database."
        )

    test_database_url = URL.create(
        drivername="postgresql+psycopg",
        username=settings.db_user,
        password=settings.db_password,
        host=settings.db_host,
        port=settings.db_port,
        database=TEST_DATABASE_NAME,
    )

    engine = create_engine(
        test_database_url,
        pool_pre_ping=True,
    )

    with engine.connect() as connection:
        connected_database = connection.exec_driver_sql(
            "SELECT current_database()"
        ).scalar_one()

        if connected_database != TEST_DATABASE_NAME:
            raise RuntimeError(
                f"Connected to unexpected database: {connected_database}"
            )

    Base.metadata.create_all(bind=engine)

    yield engine

    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture
def db_session(test_engine):
    connection = test_engine.connect()
    transaction = connection.begin()

    testing_session_local = sessionmaker(
        bind=connection,
        autoflush=False,
        autocommit=False,
        join_transaction_mode="create_savepoint",
    )

    db = testing_session_local()

    try:
        yield db
    finally:
        db.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def client(db_session):
    def override_get_auth_db():
        yield db_session

    app.dependency_overrides[get_auth_db] = override_get_auth_db

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.pop(get_auth_db, None)
