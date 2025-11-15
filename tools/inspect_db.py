from backend.database.db import db
from backend.app import app
import json

with app.app_context():
    res = db.session.execute(db.text('PRAGMA table_info(turnos);'))
    cols = res.fetchall()
    print(json.dumps([tuple(c) for c in cols], ensure_ascii=False))
