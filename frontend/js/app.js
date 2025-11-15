// ===========================
// APLICACIÓN PRINCIPAL
// ===========================

let currentPage = 'dashboard';

const Pages = {
    dashboard: {
        title: 'Dashboard',
        render: async () => {
            try {
                const pacientes = await Pacientes.obtenerTodos();
                const medicos = await Medicos.obtenerTodos();
                const especialidades = await Especialidades.obtenerTodos();
                const historiales = await Historiales.obtenerTodos();

                return `
                    <div class="dashboard-grid">
                        <div class="stat-card"><div class="icon">📊</div><div class="number">${pacientes.length}</div><div class="label">Pacientes</div></div>
                        <div class="stat-card"><div class="icon">🩺</div><div class="number">${medicos.length}</div><div class="label">Médicos</div></div>
                        <div class="stat-card"><div class="icon">📚</div><div class="number">${especialidades.length}</div><div class="label">Especialidades</div></div>
                        <div class="stat-card"><div class="icon">📁</div><div class="number">${historiales.length}</div><div class="label">Historiales</div></div>
                    </div>
                    <div class="card">
                        <div class="card-header"><h3>Últimos Pacientes</h3></div>
                        <div class="table-container">${createTable(pacientes.slice(0,5), [{key:'nombre',label:'Nombre'},{key:'apellido',label:'Apellido'},{key:'dni',label:'DNI'},{key:'email',label:'Email'}])}</div>
                    </div>
                `;
            } catch (err) {
                return `<div class="alert alert-danger">Error cargando dashboard: ${err.message}</div>`;
            }
        }
    },

    pacientes: {
        title: 'Gestión de Pacientes',
        render: async () => {
            try {
                const pacientes = await Pacientes.obtenerTodos();
                return `
                    <div class="card">
                        <div class="card-header">
                            <h3>Pacientes</h3>
                            <button class="btn btn-primary" onclick="openModal('modal-paciente')">➕ Nuevo Paciente</button>
                        </div>
                        <div class="table-container">${createTable(pacientes, [
                            {key:'nombre',label:'Nombre'},
                            {key:'apellido',label:'Apellido'},
                            {key:'dni',label:'DNI'},
                            {key:'email',label:'Email'},
                            {key:'telefono',label:'Teléfono'}
                        ], (row)=>`<button class="btn btn-secondary btn-small" onclick="editarPaciente(${row.id_paciente})">✏️ Editar</button> <button class="btn btn-danger btn-small" onclick="eliminarPaciente(${row.id_paciente})">🗑️ Eliminar</button>`)}</div>
                    </div>

                    <div id="modal-paciente" class="modal">
                        <div class="modal-content">
                            <div class="modal-header"><h3 id="modal-paciente-title">Nuevo Paciente</h3><button class="close-btn" onclick="closeModal('modal-paciente')">×</button></div>
                            <div class="modal-body">
                                <form id="form-paciente">
                                    <div class="form-row"><div class="form-group"><label for="nombre">Nombre</label><input type="text" id="nombre" name="nombre" required></div><div class="form-group"><label for="apellido">Apellido</label><input type="text" id="apellido" name="apellido" required></div></div>
                                    <div class="form-row"><div class="form-group"><label for="dni">DNI</label><input type="text" id="dni" name="dni" required></div><div class="form-group"><label for="email">Email</label><input type="email" id="email" name="email" required></div></div>
                                    <div class="form-group"><label for="telefono">Teléfono</label><input type="tel" id="telefono" name="telefono"></div>
                                    <div class="form-actions"><button type="button" class="btn btn-secondary" onclick="closeModal('modal-paciente')">Cancelar</button><button type="submit" class="btn btn-primary">Guardar</button></div>
                                </form>
                            </div>
                        </div>
                    </div>
                `;
            } catch (err) {
                return `<div class="alert alert-danger">Error cargando pacientes: ${err.message}</div>`;
            }
        },
        init: () => {
            const form = document.getElementById('form-paciente');
            if (form) form.addEventListener('submit', guardarPaciente);
        }
    },

    medicos: {
        title: 'Gestión de Médicos',
        render: async () => {
            try {
                const medicos = await Medicos.obtenerTodos();
                return `
                    <div class="card">
                        <div class="card-header">
                            <h3>Médicos</h3>
                            <button class="btn btn-primary" onclick="openModal('modal-medico')">➕ Nuevo Médico</button>
                        </div>
                        <div class="table-container">${createTable(medicos, [
                            {key:'nombre',label:'Nombre'},
                            {key:'apellido',label:'Apellido'},
                            {key:'matricula',label:'Matrícula'},
                            {key:'dni',label:'DNI'},
                            {key:'email',label:'Email'},
                            {key:'telefono',label:'Teléfono'}
                        ], (row)=>`<button class="btn btn-secondary btn-small" onclick="editarMedico(${row.id_medico})">✏️ Editar</button> <button class="btn btn-danger btn-small" onclick="eliminarMedico(${row.id_medico})">🗑️ Eliminar</button>`)}</div>
                    </div>

                    <div id="modal-medico" class="modal">
                        <div class="modal-content">
                            <div class="modal-header"><h3 id="modal-medico-title">Nuevo Médico</h3><button class="close-btn" onclick="closeModal('modal-medico')">×</button></div>
                            <div class="modal-body">
                                <form id="form-medico">
                                    <div class="form-row"><div class="form-group"><label for="med-nombre">Nombre</label><input type="text" id="med-nombre" name="nombre" required></div><div class="form-group"><label for="med-apellido">Apellido</label><input type="text" id="med-apellido" name="apellido" required></div></div>
                                    <div class="form-row"><div class="form-group"><label for="matricula">Matrícula</label><input type="text" id="matricula" name="matricula" required></div><div class="form-group"><label for="med-dni">DNI</label><input type="text" id="med-dni" name="dni" required></div></div>
                                    <div class="form-row"><div class="form-group"><label for="med-email">Email</label><input type="email" id="med-email" name="email" required></div><div class="form-group"><label for="med-telefono">Teléfono</label><input type="tel" id="med-telefono" name="telefono"></div></div>
                                    <div class="form-actions"><button type="button" class="btn btn-secondary" onclick="closeModal('modal-medico')">Cancelar</button><button type="submit" class="btn btn-primary">Guardar</button></div>
                                </form>
                            </div>
                        </div>
                    </div>
                `;
            } catch (err) {
                return `<div class="alert alert-danger">Error cargando médicos: ${err.message}</div>`;
            }
        },
        init: () => {
            const form = document.getElementById('form-medico');
            if (form) form.addEventListener('submit', guardarMedico);
        }
    },

    especialidades: {
        title: 'Gestión de Especialidades',
        render: async () => {
            try {
                const especialidades = await Especialidades.obtenerTodos();
                return `
                    <div class="card">
                        <div class="card-header">
                            <h3>Especialidades</h3>
                            <button class="btn btn-primary" onclick="openModal('modal-especialidad')">➕ Nueva Especialidad</button>
                        </div>
                        <div class="table-container">${createTable(especialidades,[{key:'nombre',label:'Nombre'}])}</div>
                    </div>
                    <div id="modal-especialidad" class="modal">
                        <div class="modal-content">
                            <div class="modal-header"><h3>Nueva Especialidad</h3><button class="close-btn" onclick="closeModal('modal-especialidad')">×</button></div>
                            <div class="modal-body">
                                <form id="form-especialidad">
                                    <div class="form-group"><label for="esp-nombre">Nombre</label><input type="text" id="esp-nombre" name="nombre" required></div>
                                    <div class="form-actions"><button type="button" class="btn btn-secondary" onclick="closeModal('modal-especialidad')">Cancelar</button><button type="submit" class="btn btn-primary">Guardar</button></div>
                                </form>
                            </div>
                        </div>
                    </div>
                `;
            } catch(e) {
                return `<div class="alert alert-danger">Error cargando especialidades: ${e.message}</div>`;
            }
        },
        init: () => {
            const form = document.getElementById('form-especialidad');
            if (form) form.addEventListener('submit', guardarEspecialidad);
        }
    },

    calendario: {
        title: 'Calendario',
        render: async () => {
            try {
                const especialidades = await Especialidades.obtenerTodos();
                return `
                    <div class="card">
                        <div class="card-header"><h3>Calendario</h3></div>
                        <div class="form-row" style="padding:10px; gap:10px; align-items:end;">
                            <div class="form-group" style="flex:1;"><label for="cal-esp-id">Especialidad</label><select id="cal-esp-id"><option value="">-- Seleccionar especialidad --</option>${especialidades.map(e=>`<option value="${e.id_especialidad}">${e.nombre}</option>`).join('')}</select></div>
                            <div class="form-group" style="flex:1;"><label for="cal-med-id">Médico</label><select id="cal-med-id" disabled><option value="">-- Selecciona especialidad primero --</option></select></div>
                            <div style="display:flex; gap:8px; align-items:center;"><button class="btn btn-secondary" id="cal-prev-month">‹</button><div id="cal-current-month" style="min-width:180px; text-align:center; font-weight:600;"></div><button class="btn btn-secondary" id="cal-next-month">›</button></div>
                        </div>
                        <div id="calendario-mes-contenedor" style="padding:10px;"></div>
                    </div>

                    <div id="modal-dia-turnos" class="modal"><div class="modal-content" style="max-width:700px;"><div class="modal-header"><h3 id="modal-dia-title">Turnos del día</h3><button class="close-btn" onclick="closeModal('modal-dia-turnos')">×</button></div><div class="modal-body" id="modal-dia-body"></div><div class="modal-footer" style="padding:16px; text-align:right;"><button class="btn btn-primary" id="btn-nuevo-turno-dia">Nuevo Turno</button></div></div></div>

                    <div id="modal-nuevo-turno" class="modal"><div class="modal-content"><div class="modal-header"><h3>Nuevo Turno</h3><button class="close-btn" onclick="closeModal('modal-nuevo-turno')">×</button></div><div class="modal-body"><form id="form-nuevo-turno"><input type="hidden" id="nuevo-medico-id" name="medico_id"><input type="hidden" id="nuevo-especialidad-id" name="especialidad_id"><div class="form-group"><label for="nuevo-paciente-id">Paciente</label><select id="nuevo-paciente-id" name="paciente_id" required><option value="">-- Seleccionar paciente --</option></select></div><div class="form-row"><div class="form-group"><label for="nuevo-fecha">Fecha</label><input type="date" id="nuevo-fecha" name="fecha" required></div><div class="form-group"><label for="nuevo-hora">Hora</label><input type="time" id="nuevo-hora" name="hora" required></div><div class="form-group"><label for="nuevo-duracion">Duración</label><select id="nuevo-duracion" name="duracion_minutos"><option value="15">15</option><option value="30" selected>30</option><option value="45">45</option><option value="60">60</option></select></div></div><div class="form-actions" style="margin-top:12px; text-align:right;"><button type="button" class="btn btn-secondary" onclick="closeModal('modal-nuevo-turno')">Cancelar</button><button type="submit" class="btn btn-primary">Crear Turno</button></div></form></div></div></div>
                `;
            } catch (err) {
                return `<div class="alert alert-danger">Error cargando calendario: ${err.message}</div>`;
            }
        },
        init: () => {
            // Elementos
            const selectEsp = document.getElementById('cal-esp-id');
            const selectMed = document.getElementById('cal-med-id');
            const contenedor = document.getElementById('calendario-mes-contenedor');
            const monthLabel = document.getElementById('cal-current-month');
            const btnPrev = document.getElementById('cal-prev-month');
            const btnNext = document.getElementById('cal-next-month');

            let currentYear, currentMonth;

            const setMonthLabel = (y,m) => { const d=new Date(y,m,1); monthLabel.textContent = d.toLocaleDateString('es-ES',{year:'numeric',month:'long'}); };

            const loadMedicosForEspecialidad = async (espId)=>{
                if(!espId) return;
                try{
                    const medicos = await Medicos.obtenerPorEspecialidad(parseInt(espId));
                    if(!Array.isArray(medicos) || medicos.length===0){ selectMed.innerHTML='<option value="">-- No hay médicos --</option>'; selectMed.disabled=true; }
                    else { selectMed.disabled=false; selectMed.innerHTML = '<option value="">-- Seleccionar médico --</option>' + medicos.map(m=>`<option value="${m.id_medico}">${m.nombre} ${m.apellido}</option>`).join(''); }
                }catch(e){ showAlert(`Error cargando médicos: ${e.message}`,'danger'); selectMed.disabled=true; }
            };

            const renderCalendar = async (medicoId, year, month) => {
                contenedor.innerHTML = '<p style="color:#999;text-align:center;">Cargando calendario...</p>';
                if(!medicoId){ contenedor.innerHTML = '<p style="color:#999;text-align:center;">Selecciona un médico para ver el calendario</p>'; return; }
                try{
                    const turnos = await Turnos.obtenerPorMedico(medicoId);
                    const turnosMes = turnos.filter(t=>{ const [y,mo,d]=t.fecha.split('-').map(Number); return y===year && (mo-1)===month; });

                    const firstDay = new Date(year,month,1);
                    const lastDay = new Date(year,month+1,0);
                    const daysInMonth = lastDay.getDate();
                    const startWeekday = firstDay.getDay();

                    let html = '<div class="calendar-month"><div class="calendar-weekdays">';
                    ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'].forEach(dn=> html += `<div class="calendar-weekday">${dn}</div>`);
                    html += '</div><div class="calendar-days">';

                    for(let i=0;i<startWeekday;i++) html += '<div class="calendar-day empty"></div>';

                    for(let d=1; d<=daysInMonth; d++){
                        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
                        const turnosDia = turnosMes.filter(t=>t.fecha===dateStr);
                        const count = turnosDia.length;
                        html += `<div class="calendar-day" data-fecha="${dateStr}"><div class="day-number">${d}</div><div class="day-count">${count>0?count+' turno'+(count>1?'s':''):''}</div></div>`;
                    }

                    html += '</div></div>';
                    contenedor.innerHTML = html;

                    contenedor.querySelectorAll('.calendar-day').forEach(el=> el.addEventListener('click', async ()=>{ const fecha = el.dataset.fecha; const medicoIdNum = parseInt(selectMed.value); await abrirModalDia(fecha, medicoIdNum); }));
                }catch(e){ contenedor.innerHTML = `<div class="alert alert-danger">Error cargando calendario: ${e.message}</div>`; }
            };

            const abrirModalDia = async (fecha, medicoId) => {
                try{
                    const turnos = await Turnos.obtenerPorMedico(medicoId);
                    const turnosDia = turnos.filter(t=>t.fecha===fecha).sort((a,b)=>a.hora.localeCompare(b.hora));
                    const pacientes = await Pacientes.obtenerTodos();

                    let html = `<div style="padding:12px;"><h4>${fecha}</h4>`;
                    if(turnosDia.length===0) html += '<p style="color:#999">No hay turnos para este día.</p>';
                    else{ html += '<ul style="list-style:none;padding:0;">'; for(const t of turnosDia){ const pac = pacientes.find(p=>p.id_paciente===t.paciente_id)||{nombre:'-',apellido:''}; const horaFin = calcularHoraFin(t.hora,t.duracion_minutos); html += `<li style="padding:8px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center;"><div><strong>${t.hora} - ${horaFin}</strong><br>${pac.nombre} ${pac.apellido}</div><div style="font-size:0.9em;color:#666">${t.estado}</div></li>`; } html += '</ul>'; }
                    html += '</div>';

                    document.getElementById('modal-dia-title').textContent = `Turnos - ${fecha}`;
                    document.getElementById('modal-dia-body').innerHTML = html;
                    openModal('modal-dia-turnos');

                    const btnNuevo = document.getElementById('btn-nuevo-turno-dia');
                    btnNuevo.onclick = ()=>{
                        document.getElementById('nuevo-medico-id').value = medicoId;
                        const espSel = selectEsp.value;
                        document.getElementById('nuevo-especialidad-id').value = espSel;
                        document.getElementById('nuevo-fecha').value = fecha;
                        const selPac = document.getElementById('nuevo-paciente-id'); selPac.innerHTML = '<option value="">-- Seleccionar paciente --</option>' + pacientes.map(p=>`<option value="${p.id_paciente}">${p.nombre} ${p.apellido}</option>`).join('');
                        closeModal('modal-dia-turnos'); openModal('modal-nuevo-turno');
                    };
                }catch(e){ showAlert(`Error al abrir día: ${e.message}`,'danger'); }
            };

            const hoy = new Date(); currentYear = hoy.getFullYear(); currentMonth = hoy.getMonth(); setMonthLabel(currentYear,currentMonth);

            selectEsp.addEventListener('change', async (e)=>{ await loadMedicosForEspecialidad(e.target.value); document.getElementById('calendario-mes-contenedor').innerHTML = '<p style="color:#999;text-align:center;">Selecciona un médico para ver el calendario</p>'; });

            selectMed.addEventListener('change', async (e)=>{ const medicoId = e.target.value?parseInt(e.target.value):null; setMonthLabel(currentYear,currentMonth); await renderCalendar(medicoId,currentYear,currentMonth); });

            btnPrev.addEventListener('click', async ()=>{ currentMonth -=1; if(currentMonth<0){ currentMonth=11; currentYear-=1;} setMonthLabel(currentYear,currentMonth); const medicoId = selectMed.value?parseInt(selectMed.value):null; await renderCalendar(medicoId,currentYear,currentMonth); });
            btnNext.addEventListener('click', async ()=>{ currentMonth +=1; if(currentMonth>11){ currentMonth=0; currentYear+=1;} setMonthLabel(currentYear,currentMonth); const medicoId = selectMed.value?parseInt(selectMed.value):null; await renderCalendar(medicoId,currentYear,currentMonth); });

            const formNuevo = document.getElementById('form-nuevo-turno');
            if(formNuevo){ formNuevo.addEventListener('submit', async (e)=>{ e.preventDefault(); try{ const data = getFormData('form-nuevo-turno'); data.duracion_minutos = parseInt(data.duracion_minutos); data.medico_id = parseInt(data.medico_id); data.especialidad_id = parseInt(data.especialidad_id); await Turnos.crear(data); showAlert('Turno creado correctamente','success'); closeModal('modal-nuevo-turno'); const medicoSel = selectMed.value?parseInt(selectMed.value):null; await renderCalendar(medicoSel,currentYear,currentMonth); }catch(err){ showAlert(`Error: ${err.message}`,'danger'); } }); }
        }
    },

    turnos: {
        title: 'Gestión de Turnos',
        render: async () => {
            try {
                const turnos = await Turnos.obtenerTodos();
                const medicos = await Medicos.obtenerTodos();
                const pacientes = await Pacientes.obtenerTodos();
                const especialidades = await Especialidades.obtenerTodos();

                const turnosConDetalles = turnos.map(t => ({
                    ...t,
                    medico: medicos.find(m => m.id_medico === t.medico_id) || {},
                    paciente: pacientes.find(p => p.id_paciente === t.paciente_id) || {},
                    especialidad: especialidades.find(e => e.id_especialidad === t.especialidad_id) || {}
                }));

                return `
                    <div class="card">
                        <div class="card-header">
                            <h3>Gestión de Turnos</h3>
                        </div>
                        <div class="table-container">${createTable(turnosConDetalles, [
                            {key:'id_turno',label:'ID'},
                            {key:'fecha',label:'Fecha'},
                            {key:'hora',label:'Hora'},
                            {key:'medico',label:'Médico',render: (row) => row.medico?.nombre + ' ' + (row.medico?.apellido || '')},
                            {key:'paciente',label:'Paciente',render: (row) => row.paciente?.nombre + ' ' + (row.paciente?.apellido || '')},
                            {key:'especialidad',label:'Especialidad',render: (row) => row.especialidad?.nombre || '-'},
                            {key:'duracion_minutos',label:'Duración (min)'},
                            {key:'estado',label:'Estado'}
                        ])}</div>
                    </div>
                `;
            } catch (err) {
                return `<div class="alert alert-danger">Error cargando turnos: ${err.message}</div>`;
            }
        }
    },

    'calendario-turnos': {
        title: 'Calendario de Turnos',
        render: async () => {
            try {
                const medicos = await Medicos.obtenerTodos();
                return `
                    <div class="card">
                        <div class="card-header">
                            <h3>Calendario Semanal de Turnos</h3>
                        </div>
                        <div class="form-group" style="margin:20px;">
                            <label for="medico-calendario">Seleccionar Médico</label>
                            <select id="medico-calendario" onchange="cargarCalendarioMedico(this.value)">
                                <option value="">-- Elige un médico --</option>
                                ${medicos.map(m => `<option value="${m.id_medico}">${m.nombre} ${m.apellido}</option>`).join('')}
                            </select>
                        </div>
                        <div id="calendario-contenido" style="margin:20px;">
                            <p style="color:#999;text-align:center;">Selecciona un médico para ver su calendario</p>
                        </div>
                        <div id="modal-detalle-turno" class="modal">
                            <div class="modal-content" style="max-width:500px;">
                                <div class="modal-header">
                                    <h3>Detalles del Turno</h3>
                                    <button class="close-btn" onclick="closeModal('modal-detalle-turno')">×</button>
                                </div>
                                <div class="modal-body" id="detalle-turno-contenido"></div>
                            </div>
                        </div>
                    </div>
                `;
            } catch (e) {
                return `<div class="alert alert-danger">Error cargando calendario: ${e.message}</div>`;
            }
        }
    }
};

// ===========================
// FUNCIONES CRUD
// ===========================

async function guardarPaciente(e) {
    e.preventDefault();
    try {
        const form = document.getElementById('form-paciente');
        const editingId = form.dataset.editingId;
        const data = getFormData('form-paciente');
        if (editingId) {
            await Pacientes.actualizar(editingId, data);
            showAlert('Paciente actualizado correctamente', 'success');
            delete form.dataset.editingId;
        } else {
            await Pacientes.crear(data);
            showAlert('Paciente creado correctamente', 'success');
        }
        closeModal('modal-paciente');
        clearForm('form-paciente');
        document.getElementById('modal-paciente-title').textContent = 'Nuevo Paciente';
        loadPage('pacientes');
    } catch (err) {
        showAlert(`Error: ${err.message}`, 'danger');
    }
}

async function editarPaciente(id) {
    try {
        const paciente = await Pacientes.obtenerPorId(id);
        document.getElementById('nombre').value = paciente.nombre;
        document.getElementById('apellido').value = paciente.apellido;
        document.getElementById('dni').value = paciente.dni;
        document.getElementById('email').value = paciente.email;
        document.getElementById('telefono').value = paciente.telefono || '';
        const form = document.getElementById('form-paciente');
        form.dataset.editingId = id;
        document.getElementById('modal-paciente-title').textContent = 'Editar Paciente';
        openModal('modal-paciente');
    } catch (err) {
        showAlert(`Error: ${err.message}`, 'danger');
    }
}

async function eliminarPaciente(id) {
    if (!window.confirm('¿Está seguro que desea eliminar este paciente?')) return;
    try {
        await Pacientes.eliminar(id);
        showAlert('Paciente eliminado correctamente', 'success');
        loadPage('pacientes');
    } catch (err) {
        showAlert(`Error: ${err.message}`, 'danger');
    }
}

async function guardarMedico(e) {
    e.preventDefault();
    try {
        const form = document.getElementById('form-medico');
        const editingId = form.dataset.editingId;
        const data = getFormData('form-medico');
        if (editingId) {
            await Medicos.actualizar(editingId, data);
            showAlert('Médico actualizado correctamente', 'success');
            delete form.dataset.editingId;
        } else {
            await Medicos.crear(data);
            showAlert('Médico creado correctamente', 'success');
        }
        closeModal('modal-medico');
        clearForm('form-medico');
        document.getElementById('modal-medico-title').textContent = 'Nuevo Médico';
        loadPage('medicos');
    } catch (err) {
        showAlert(`Error: ${err.message}`, 'danger');
    }
}

async function editarMedico(id) {
    try {
        const medico = await Medicos.obtenerPorId(id);
        document.getElementById('med-nombre').value = medico.nombre;
        document.getElementById('med-apellido').value = medico.apellido;
        document.getElementById('matricula').value = medico.matricula;
        document.getElementById('med-dni').value = medico.dni;
        document.getElementById('med-email').value = medico.email;
        document.getElementById('med-telefono').value = medico.telefono || '';
        const form = document.getElementById('form-medico');
        form.dataset.editingId = id;
        document.getElementById('modal-medico-title').textContent = 'Editar Médico';
        openModal('modal-medico');
    } catch (err) {
        showAlert(`Error: ${err.message}`, 'danger');
    }
}

async function eliminarMedico(id) {
    if (!window.confirm('¿Está seguro que desea eliminar este médico?')) return;
    try {
        await Medicos.eliminar(id);
        showAlert('Médico eliminado correctamente', 'success');
        loadPage('medicos');
    } catch (err) {
        showAlert(`Error: ${err.message}`, 'danger');
    }
}

async function guardarEspecialidad(e) {
    e.preventDefault();
    try {
        const data = getFormData('form-especialidad');
        await Especialidades.crear(data);
        showAlert('Especialidad creada correctamente', 'success');
        closeModal('modal-especialidad');
        clearForm('form-especialidad');
        loadPage('especialidades');
    } catch (err) {
        showAlert(`Error: ${err.message}`, 'danger');
    }
}

function calcularHoraFin(horaInicio, minutosAdicionados) {
    const [h, m] = horaInicio.split(':').map(Number);
    const total = h * 60 + m + minutosAdicionados;
    const hf = Math.floor(total / 60);
    const mf = total % 60;
    return `${String(hf).padStart(2, '0')}:${String(mf).padStart(2, '0')}`;
}

// Funciones auxiliares para calendario
function obtenerSemanaPrincipal() {
    const hoy = new Date();
    const diaActual = hoy.getDay();
    const diferencia = hoy.getDate() - diaActual + 1;
    const lunes = new Date(hoy);
    lunes.setDate(diferencia);
    return lunes;
}

function formatearFecha(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function obtenerNombreDia(date) {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[date.getDay()];
}

async function cargarCalendarioMedico(medicoId) {
    if (!medicoId) {
        document.getElementById('calendario-contenido').innerHTML = '<p style="color:#999; text-align:center;">Selecciona un médico para ver su calendario</p>';
        return;
    }
    try {
        const turnos = await Turnos.obtenerPorMedico(medicoId);
        const lunes = obtenerSemanaPrincipal();
        const dias = [];
        for (let i = 0; i < 7; i++) {
            const fecha = new Date(lunes);
            fecha.setDate(fecha.getDate() + i);
            dias.push({
                fecha: formatearFecha(fecha),
                nombre: obtenerNombreDia(fecha),
                dia: fecha.getDate(),
                turnos: []
            });
        }
        turnos.forEach(t => {
            const dia = dias.find(d => d.fecha === t.fecha);
            if (dia) dia.turnos.push(t);
        });
        dias.forEach(d => d.turnos.sort((a, b) => a.hora.localeCompare(b.hora)));
        let html = '<div class="calendario-semana">';
        dias.forEach(d => {
            html += `<div class="dia-semana"><div class="dia-header"><strong>${d.nombre}</strong><span>${d.dia}</span></div><div class="turnos-dia">`;
            if (d.turnos.length === 0) html += '<p style="color:#999;text-align:center;padding:20px;font-size:0.9em;">Sin turnos</p>';
            else {
                d.turnos.forEach(turno => {
                    const colorEstado = turno.estado === 'pendiente' ? '#ff9500' : (turno.estado === 'completado' ? '#28a745' : '#6c757d');
                    const horaFin = calcularHoraFin(turno.hora, turno.duracion_minutos);
                    html += `<div class="turno-card" style="border-left:4px solid ${colorEstado};cursor:pointer;" onclick="mostrarDetalleTurno(${turno.id_turno},${turno.paciente_id},${turno.medico_id},${turno.especialidad_id})"><div class="turno-hora">${turno.hora} - ${horaFin}</div><div class="turno-duracion" style="font-size:0.8em;color:#666;">${turno.duracion_minutos} min</div><div class="turno-estado" style="font-size:0.8em;color:${colorEstado};">${turno.estado}</div></div>`;
                });
            }
            html += '</div></div>';
        });
        html += '</div>';
        document.getElementById('calendario-contenido').innerHTML = html;
    } catch (err) {
        showAlert(`Error: ${err.message}`, 'danger');
    }
}

async function mostrarDetalleTurno(turnoId, pacienteId, medicoId, especialidadId) {
    try {
        const turnos = await Turnos.obtenerPorMedico(medicoId);
        const turnoDetalle = turnos.find(t => t.id_turno === turnoId);
        if (!turnoDetalle) {
            showAlert('Turno no encontrado', 'danger');
            return;
        }
        const paciente = await Pacientes.obtenerPorId(pacienteId);
        const medico = await Medicos.obtenerPorId(medicoId);
        const especialidades = await Especialidades.obtenerTodos();
        const especialidad = especialidades.find(e => e.id_especialidad === especialidadId) || { nombre: '-' };
        const horaFin = calcularHoraFin(turnoDetalle.hora, turnoDetalle.duracion_minutos);
        const colorEstado = turnoDetalle.estado === 'pendiente' ? '#ff9500' : (turnoDetalle.estado === 'completado' ? '#28a745' : '#6c757d');
        const html = `<div style="padding:20px;"><div style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #ddd;"><h4>Información del Turno</h4><p><strong>ID:</strong> #${turnoDetalle.id_turno}</p><p><strong>Estado:</strong> <span style="color:${colorEstado};font-weight:bold;">${turnoDetalle.estado.toUpperCase()}</span></p><p><strong>Fecha:</strong> ${turnoDetalle.fecha}</p><p><strong>Hora:</strong> ${turnoDetalle.hora} - ${horaFin}</p><p><strong>Duración:</strong> ${turnoDetalle.duracion_minutos} minutos</p></div><div style="margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid #ddd;"><h4>Paciente</h4><p><strong>Nombre:</strong> ${paciente.nombre} ${paciente.apellido}</p><p><strong>DNI:</strong> ${paciente.dni}</p><p><strong>Email:</strong> ${paciente.email}</p><p><strong>Teléfono:</strong> ${paciente.telefono || 'No registrado'}</p></div><div style="margin-bottom:20px;"><h4>Médico</h4><p><strong>Nombre:</strong> ${medico.nombre} ${medico.apellido}</p><p><strong>Matrícula:</strong> ${medico.matricula}</p><p><strong>Especialidad:</strong> ${especialidad.nombre}</p></div><div class="form-actions"><button type="button" class="btn btn-secondary" onclick="closeModal('modal-detalle-turno')">Cerrar</button></div></div>`;
        document.getElementById('detalle-turno-contenido').innerHTML = html;
        openModal('modal-detalle-turno');
    } catch (err) {
        showAlert(`Error: ${err.message}`, 'danger');
    }
}

// Navegación y carga de páginas
async function loadPage(page) {
    try {
        currentPage = page;
        const pageData = Pages[page];
        if (!pageData) {
            console.error('Página no encontrada:', page);
            return;
        }
        document.getElementById('page-title').textContent = pageData.title;
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) item.classList.add('active');
        });
        const content = await pageData.render();
        document.getElementById('content').innerHTML = content;
        if (pageData.init) pageData.init();
    } catch (err) {
        console.error('Error cargando página:', err);
        let errorMsg = err.message;
        if (err.message && (err.message.includes('Failed to fetch') || err instanceof TypeError))
            errorMsg = 'Error de conexión: No se pudo conectar con el servidor backend. Verifica que http://localhost:5000 esté activo.';
        document.getElementById('content').innerHTML = `<div class="alert alert-danger"><strong>Error:</strong> ${errorMsg}</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.menu-item').forEach(item =>
        item.addEventListener('click', (e) => {
            e.preventDefault();
            loadPage(item.dataset.page);
        })
    );
    loadPage('dashboard');
});

