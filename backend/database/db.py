from flask_sqlalchemy import SQLAlchemy


class DatabaseConnection:

    _instance = None
    _db = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            cls._db = SQLAlchemy()
        return cls._instance

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._db

    @classmethod
    def init_app(cls, app):
        db = cls.get_instance()
        db.init_app(app)
        return db


db = DatabaseConnection.get_instance()
