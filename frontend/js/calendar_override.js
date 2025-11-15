(function () {
    if (typeof window === 'undefined' || !window.Pages) {
        return;
    }

    delete Pages.turnos;
    delete Pages['calendario-turnos'];

    Pages.calendario = {
        title: 'Calendario de Turnos',
        render: async () => {
            try {
                const especialidades = await Especialidades.obtenerTodos();
                return `
                    <div class="card">
                        <div class="card-header">
                            <h3>Calendario de Turnos</h3>
                            <p class="text-muted">Selecciona una especialidad y un medico para revisar los turnos programados.</p>
                        </div>
                        <div class="calendar-controls">
                            <div class="form-group">
                                <label for="calendar-especialidad">Especialidad</label>
                                <select id="calendar-especialidad">
                                    <option value="">-- Seleccionar especialidad --</option>
                                    ${especialidades.map(e => `<option value="${e.id_especialidad}">${e.nombre}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="calendar-medico">Medico</label>
                                <select id="calendar-medico" disabled>
                                    <option value="">-- Selecciona una especialidad primero --</option>
                                </select>
                            </div>
                            <div class="calendar-month-nav">
                                <button class="btn btn-secondary" id="calendar-prev" title="Mes anterior">&lsaquo;</button>
                                <div id="calendar-month-label" class="calendar-month-label"></div>
                                <button class="btn btn-secondary" id="calendar-next" title="Mes siguiente">&rsaquo;</button>
                            </div>
                        </div>
                        <div id="calendar-status" class="calendar-status">Selecciona una especialidad para comenzar.</div>
                        <div class="calendar-weekdays">
                            <span>Dom</span>
                            <span>Lun</span>
                            <span>Mar</span>
                            <span>Mie</span>
                            <span>Jue</span>
                            <span>Vie</span>
                            <span>Sab</span>
                        </div>
                        <div id="calendar-grid" class="calendar-grid"></div>
                        <div id="calendar-day-details" class="calendar-day-details">
                            <div class="day-details-header">
                                <div>
                                    <h4 id="day-details-title">Sin dia seleccionado</h4>
                                    <p id="day-details-summary" class="text-muted">Selecciona un dia del calendario para ver sus turnos.</p>
                                </div>
                                <button class="btn btn-primary" id="calendar-create-turno" disabled>Nuevo Turno</button>
                            </div>
                            <div id="day-details-content" class="day-details-content">
                                <p class="text-muted">Aun no se ha seleccionado ningun dia.</p>
                            </div>
                        </div>
                    </div>

                    <div id="modal-nuevo-turno" class="modal">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h3>Nuevo Turno</h3>
                                <button class="close-btn" onclick="closeModal('modal-nuevo-turno')">&times;</button>
                            </div>
                            <div class="modal-body">
                                <form id="form-nuevo-turno">
                                    <input type="hidden" id="nuevo-medico-id" name="medico_id">
                                    <input type="hidden" id="nuevo-especialidad-id" name="especialidad_id">
                                    <div class="form-group">
                                        <label for="nuevo-paciente-id">Paciente</label>
                                        <select id="nuevo-paciente-id" name="paciente_id" required>
                                            <option value="">-- Seleccionar paciente --</option>
                                        </select>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label for="nuevo-fecha">Fecha</label>
                                            <input type="date" id="nuevo-fecha" name="fecha" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="nuevo-hora">Hora</label>
                                            <input type="time" id="nuevo-hora" name="hora" required>
                                        </div>
                                        <div class="form-group">
                                            <label for="nuevo-duracion">Duracion</label>
                                            <select id="nuevo-duracion" name="duracion_minutos">
                                                <option value="15">15</option>
                                                <option value="30" selected>30</option>
                                                <option value="45">45</option>
                                                <option value="60">60</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="form-actions" style="margin-top:12px; text-align:right;">
                                        <button type="button" class="btn btn-secondary" onclick="closeModal('modal-nuevo-turno')">Cancelar</button>
                                        <button type="submit" class="btn btn-primary">Crear Turno</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                `;
            } catch (err) {
                return `<div class="alert alert-danger">Error cargando calendario: ${err.message}</div>`;
            }
        },
        init: () => {
            const selectEsp = document.getElementById('calendar-especialidad');
            if (!selectEsp) return;

            const selectMed = document.getElementById('calendar-medico');
            const monthLabel = document.getElementById('calendar-month-label');
            const btnPrev = document.getElementById('calendar-prev');
            const btnNext = document.getElementById('calendar-next');
            const grid = document.getElementById('calendar-grid');
            const status = document.getElementById('calendar-status');
            const dayTitle = document.getElementById('day-details-title');
            const daySummary = document.getElementById('day-details-summary');
            const dayContent = document.getElementById('day-details-content');
            const btnCreate = document.getElementById('calendar-create-turno');
            const formNuevo = document.getElementById('form-nuevo-turno');
            const hiddenMedico = document.getElementById('nuevo-medico-id');
            const hiddenEsp = document.getElementById('nuevo-especialidad-id');
            const inputFecha = document.getElementById('nuevo-fecha');
            const selectPacienteModal = document.getElementById('nuevo-paciente-id');

            const state = {
                currentYear: new Date().getFullYear(),
                currentMonth: new Date().getMonth(),
                especialidadId: null,
                medicoId: null,
                selectedDate: null,
                turnos: []
            };

            let pacientesCache = null;

            const ensurePacientes = async () => {
                if (!pacientesCache) {
                    pacientesCache = await Pacientes.obtenerTodos();
                }
                return pacientesCache;
            };

            const formatMonthLabel = () => {
                if (!monthLabel) return;
                const current = new Date(state.currentYear, state.currentMonth, 1);
                monthLabel.textContent = current.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
            };

            const showStatus = (message) => {
                if (!status) return;
                status.textContent = message || '';
                status.style.display = message ? 'block' : 'none';
            };

            const clearDayDetails = () => {
                state.selectedDate = null;
                if (dayTitle) dayTitle.textContent = 'Sin dia seleccionado';
                if (daySummary) daySummary.textContent = 'Selecciona un dia del calendario para ver sus turnos.';
                if (dayContent) dayContent.innerHTML = '<p class="text-muted">Aun no se ha seleccionado ningun dia.</p>';
                if (btnCreate) btnCreate.disabled = true;
            };

            const loadMedicos = async (especialidadId) => {
                if (!selectMed) return;
                selectMed.disabled = true;
                selectMed.innerHTML = '<option value="">Cargando medicos...</option>';
                try {
                    const medicos = await Medicos.obtenerPorEspecialidad(especialidadId);
                    if (!Array.isArray(medicos) || medicos.length === 0) {
                        selectMed.innerHTML = '<option value="">No hay medicos disponibles</option>';
                        showStatus('No hay medicos para la especialidad seleccionada.');
                        return;
                    }
                    selectMed.innerHTML = '<option value="">-- Seleccionar medico --</option>' +
                        medicos.map(m => `<option value="${m.id_medico}">${m.nombre} ${m.apellido}</option>`).join('');
                    selectMed.disabled = false;
                    showStatus('Selecciona un medico para ver el calendario.');
                } catch (error) {
                    selectMed.innerHTML = '<option value="">Error al cargar medicos</option>';
                    showAlert(`Error cargando medicos: ${error.message}`, 'danger');
                }
            };

            const formatFechaHumana = (fecha) => {
                const [year, month, day] = fecha.split('-').map(Number);
                return new Date(year, month - 1, day).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });
            };

            const handleDaySelection = async (fecha) => {
                state.selectedDate = fecha;
                if (grid) {
                    grid.querySelectorAll('.calendar-day-button').forEach(btn => {
                        btn.classList.toggle('selected', btn.dataset.fecha === fecha);
                    });
                }

                const turnosDia = state.turnos.filter(t => t.fecha === fecha).sort((a, b) => a.hora.localeCompare(b.hora));
                const pacientes = await ensurePacientes();
                const pacientesMap = new Map(pacientes.map(p => [p.id_paciente, p]));
                const medicoLabel = selectMed?.options[selectMed.selectedIndex]?.text || '';
                const especialidadLabel = selectEsp?.options[selectEsp.selectedIndex]?.text || '';

                if (dayTitle) dayTitle.textContent = `Turnos del ${formatFechaHumana(fecha)}`;
                if (daySummary) {
                    daySummary.textContent = `${turnosDia.length} turno${turnosDia.length === 1 ? '' : 's'} · ${medicoLabel} · ${especialidadLabel}`;
                }

                if (!turnosDia.length) {
                    if (dayContent) dayContent.innerHTML = '<p class="text-muted">No hay turnos para este dia.</p>';
                } else if (dayContent) {
                    dayContent.innerHTML = turnosDia.map(turno => {
                        const paciente = pacientesMap.get(turno.paciente_id);
                        const nombrePaciente = paciente ? `${paciente.nombre} ${paciente.apellido}` : 'Paciente sin datos';
                        const horaFin = calcularHoraFin(turno.hora, turno.duracion_minutos);
                        return `<div class="day-turno"><div><div class="turno-hora">${turno.hora} - ${horaFin}</div><div class="turno-meta">${nombrePaciente}</div></div><div class="turno-meta">${turno.estado}</div></div>`;
                    }).join('');
                }

                if (btnCreate) {
                    btnCreate.disabled = false;
                    btnCreate.dataset.fecha = fecha;
                }
            };

            const renderCalendar = () => {
                formatMonthLabel();
                if (!grid) return;
                if (!state.medicoId || !state.especialidadId) {
                    grid.innerHTML = '';
                    showStatus('Selecciona una especialidad y un medico para ver el calendario.');
                    return;
                }

                showStatus('');
                const firstDay = new Date(state.currentYear, state.currentMonth, 1).getDay();
                const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
                const monthNumber = String(state.currentMonth + 1).padStart(2, '0');

                let html = '';
                let alignedFirstDay = false;
                for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
                    const dateStr = `${state.currentYear}-${monthNumber}-${String(dayNumber).padStart(2, '0')}`;
                    const count = state.turnos.filter(t => t.fecha === dateStr).length;
                    const classes = ['calendar-day', 'calendar-day-button'];
                    classes.push(count > 0 ? 'has-turnos' : 'no-turnos');
                    if (state.selectedDate === dateStr) classes.push('selected');
                    const offset = (!alignedFirstDay && firstDay > 0)
                        ? ` style="grid-column-start: ${firstDay + 1};"`
                        : '';
                    alignedFirstDay = true;
                    const label = count ? `${count} turno${count === 1 ? '' : 's'}` : 'Sin turnos';
                    html += `<button type="button" class="${classes.join(' ')}" data-fecha="${dateStr}"${offset}><span class="day-number">${dayNumber}</span><span class="day-count">${label}</span></button>`;
                }
                grid.innerHTML = html;
                grid.querySelectorAll('.calendar-day-button').forEach(btn => {
                    btn.addEventListener('click', () => handleDaySelection(btn.dataset.fecha));
                });
            };

            const refreshTurnos = async () => {
                if (!state.medicoId || !state.especialidadId) {
                    if (grid) grid.innerHTML = '';
                    showStatus('Selecciona una especialidad y un medico para ver el calendario.');
                    clearDayDetails();
                    return;
                }
                showStatus('Cargando calendario...');
                try {
                    const turnosMedico = await Turnos.obtenerPorMedico(state.medicoId);
                    state.turnos = turnosMedico.filter(t => t.especialidad_id === state.especialidadId);
                    renderCalendar();
                    if (state.selectedDate) {
                        const [selYear, selMonth] = state.selectedDate.split('-').map(Number);
                        if (selYear === state.currentYear && selMonth === state.currentMonth + 1) {
                            await handleDaySelection(state.selectedDate);
                        } else {
                            clearDayDetails();
                        }
                    }
                } catch (error) {
                    showStatus(`Error cargando calendario: ${error.message}`);
                    if (grid) grid.innerHTML = '';
                }
            };

            selectEsp.addEventListener('change', async (event) => {
                const value = parseInt(event.target.value, 10);
                state.especialidadId = Number.isNaN(value) ? null : value;
                state.medicoId = null;
                state.turnos = [];
                clearDayDetails();
                if (!state.especialidadId) {
                    if (selectMed) {
                        selectMed.disabled = true;
                        selectMed.innerHTML = '<option value="">-- Selecciona una especialidad primero --</option>';
                    }
                    if (grid) grid.innerHTML = '';
                    showStatus('Selecciona una especialidad para comenzar.');
                    return;
                }
                await loadMedicos(state.especialidadId);
            });

            if (selectMed) {
                selectMed.addEventListener('change', async (event) => {
                    const value = parseInt(event.target.value, 10);
                    state.medicoId = Number.isNaN(value) ? null : value;
                    clearDayDetails();
                    await refreshTurnos();
                });
            }

            if (btnPrev) {
                btnPrev.addEventListener('click', () => {
                    state.currentMonth -= 1;
                    if (state.currentMonth < 0) {
                        state.currentMonth = 11;
                        state.currentYear -= 1;
                    }
                    renderCalendar();
                });
            }

            if (btnNext) {
                btnNext.addEventListener('click', () => {
                    state.currentMonth += 1;
                    if (state.currentMonth > 11) {
                        state.currentMonth = 0;
                        state.currentYear += 1;
                    }
                    renderCalendar();
                });
            }

            if (btnCreate) {
                btnCreate.addEventListener('click', async () => {
                    if (!state.selectedDate || !state.medicoId || !state.especialidadId) return;
                    if (hiddenMedico) hiddenMedico.value = state.medicoId;
                    if (hiddenEsp) hiddenEsp.value = state.especialidadId;
                    if (inputFecha) inputFecha.value = state.selectedDate;
                    const pacientes = await ensurePacientes();
                    if (selectPacienteModal) {
                        selectPacienteModal.innerHTML = '<option value="">-- Seleccionar paciente --</option>' +
                            pacientes.map(p => `<option value="${p.id_paciente}">${p.nombre} ${p.apellido}</option>`).join('');
                    }
                    openModal('modal-nuevo-turno');
                });
            }

            if (formNuevo) {
                formNuevo.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    try {
                        const data = getFormData('form-nuevo-turno');
                        data.duracion_minutos = parseInt(data.duracion_minutos, 10);
                        await Turnos.crear(data);
                        showAlert('Turno creado correctamente', 'success');
                        closeModal('modal-nuevo-turno');
                        await refreshTurnos();
                        if (state.selectedDate) {
                            await handleDaySelection(state.selectedDate);
                        }
                    } catch (error) {
                        showAlert(`Error: ${error.message}`, 'danger');
                    }
                });
            }

            formatMonthLabel();
            showStatus('Selecciona una especialidad para comenzar.');
            clearDayDetails();
        }
    };
})();
