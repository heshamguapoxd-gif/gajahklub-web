// ==================== CONSTANTES ====================
const STORAGE_KEY = 'tareasTodo';
const FILTER_KEY = 'filtroTodo';

// ==================== ESTADO ====================
let tareas = [];
let filtroActual = 'todas';
let categoriaActual = 'all';
let prioridadSeleccionada = 'media';

// ==================== ELEMENTOS DEL DOM ====================
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const categorySelect = document.getElementById('categorySelect');
const prioritySelect = document.getElementById('prioritySelect');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const notification = document.getElementById('notification');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

// ==================== ESCUCHADORES DE EVENTOS ====================
addBtn.addEventListener('click', agregarTarea);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        agregarTarea();
    }
});

clearCompletedBtn.addEventListener('click', limpiarCompletadas);
clearAllBtn.addEventListener('click', eliminarTodo);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filtroActual = btn.dataset.filter;
        renderizarTareas();
    });
});

categorySelect.addEventListener('change', (e) => {
    categoriaActual = e.target.value;
    renderizarTareas();
});

prioritySelect.addEventListener('change', (e) => {
    prioridadSeleccionada = e.target.value;
});

// ==================== FUNCIONES PRINCIPALES ====================

// Agregar nueva tarea
function agregarTarea() {
    const titulo = taskInput.value.trim();

    if (!titulo) {
        mostrarNotificacion('Por favor ingresa una tarea', 'error');
        return;
    }

    const nuevaTarea = {
        id: Date.now(),
        titulo: titulo,
        completada: false,
        categoria: categoriaActual !== 'all' ? categoriaActual : 'otro',
        prioridad: prioridadSeleccionada,
        creadoEn: new Date().toISOString(),
    };

    tareas.unshift(nuevaTarea);
    guardarTareas();
    renderizarTareas();
    taskInput.value = '';
    taskInput.focus();
    mostrarNotificacion('¡Tarea añadida exitosamente!', 'success');
}

// Eliminar tarea
function eliminarTarea(id) {
    tareas = tareas.filter(tarea => tarea.id !== id);
    guardarTareas();
    renderizarTareas();
    mostrarNotificacion('Tarea eliminada', 'info');
}

// Alternar estado de tarea
function alternarTarea(id) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.completada = !tarea.completada;
        guardarTareas();
        renderizarTareas();
        const mensaje = tarea.completada ? '¡Tarea completada!' : 'Tarea marcada como pendiente';
        mostrarNotificacion(mensaje, 'success');
    }
}

// Limpiar tareas completadas
function limpiarCompletadas() {
    const conteoCompletadas = tareas.filter(t => t.completada).length;

    if (conteoCompletadas === 0) {
        mostrarNotificacion('No hay tareas completadas para limpiar', 'info');
        return;
    }

    if (confirm(`¿Eliminar ${conteoCompletadas} tarea(s) completada(s)?`)) {
        tareas = tareas.filter(t => !t.completada);
        guardarTareas();
        renderizarTareas();
        mostrarNotificacion('Tareas completadas limpiadas', 'success');
    }
}

// Eliminar todas las tareas
function eliminarTodo() {
    if (tareas.length === 0) {
        mostrarNotificacion('No hay tareas para eliminar', 'info');
        return;
    }

    if (confirm(`¿Eliminar todas las ${tareas.length} tarea(s)? Esta acción no se puede deshacer.`)) {
        tareas = [];
        guardarTareas();
        renderizarTareas();
        mostrarNotificacion('Todas las tareas eliminadas', 'success');
    }
}

// ==================== FILTRADO Y ORDENAMIENTO ====================

function obtenerTareasFiltradas() {
    let filtradas = tareas;

    // Aplicar filtro de estado
    if (filtroActual === 'activas') {
        filtradas = filtradas.filter(t => !t.completada);
    } else if (filtroActual === 'completadas') {
        filtradas = filtradas.filter(t => t.completada);
    } else if (filtroActual === 'alta') {
        filtradas = filtradas.filter(t => t.prioridad === 'alta');
    }

    // Aplicar filtro de categoría
    if (categoriaActual !== 'all') {
        filtradas = filtradas.filter(t => t.categoria === categoriaActual);
    }

    return filtradas;
}

// ==================== RENDERIZACIÓN ====================

function renderizarTareas() {
    const tareasFiltradas = obtenerTareasFiltradas();
    tasksList.innerHTML = '';

    if (tareasFiltradas.length === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
        tareasFiltradas.forEach(tarea => {
            tasksList.appendChild(crearElementoTarea(tarea));
        });
    }

    actualizarEstadisticas();
}

function crearElementoTarea(tarea) {
    const div = document.createElement('div');
    div.className = `task-item priority-${tarea.prioridad}`;
    if (tarea.completada) {
        div.classList.add('completed');
    }

    const fechaTarea = new Date(tarea.creadoEn).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
    });

    div.innerHTML = `
        <input 
            type="checkbox" 
            class="checkbox" 
            ${tarea.completada ? 'checked' : ''}
            onchange="alternarTarea(${tarea.id})"
        >
        <div class="task-content">
            <div class="task-title">${escaparHtml(tarea.titulo)}</div>
            <div class="task-meta">
                <span class="task-category ${tarea.categoria}">${tarea.categoria}</span>
                <span class="task-priority ${tarea.prioridad}">${tarea.prioridad}</span>
                <span class="task-date">${fechaTarea}</span>
            </div>
        </div>
        <div class="task-actions">
            <button class="btn-action-task delete" onclick="eliminarTarea(${tarea.id})" title="Eliminar tarea">\n                <i class="fas fa-trash-alt"></i>\n            </button>\n        </div>\n    `;\n\n    return div;\n}\n\n// ==================== ESTADÍSTICAS ====================\n\nfunction actualizarEstadisticas() {\n    const total = tareas.length;\n    const completadas = tareas.filter(t => t.completada).length;\n    const pendientes = total - completadas;\n\n    totalTasksEl.textContent = total;\n    completedTasksEl.textContent = completadas;\n    pendingTasksEl.textContent = pendientes;\n}\n\n// ==================== ALMACENAMIENTO LOCAL ====================\n\nfunction guardarTareas() {\n    localStorage.setItem(STORAGE_KEY, JSON.stringify(tareas));\n}\n\nfunction cargarTareas() {\n    const almacenado = localStorage.getItem(STORAGE_KEY);\n    if (almacenado) {\n        try {\n            tareas = JSON.parse(almacenado);\n        } catch (error) {\n            console.error('Error al cargar tareas:', error);\n            tareas = [];\n        }\n    }\n}\n\n// ==================== UTILIDADES ====================\n\nfunction mostrarNotificacion(mensaje, tipo = 'info') {\n    notification.textContent = mensaje;\n    notification.className = `notification show ${tipo}`;\n\n    setTimeout(() => {\n        notification.classList.remove('show');\n    }, 3000);\n}\n\nfunction escaparHtml(texto) {\n    const div = document.createElement('div');\n    div.textContent = texto;\n    return div.innerHTML;\n}\n\n// ==================== INICIALIZACIÓN ====================\n\nfunction inicializar() {\n    cargarTareas();\n    renderizarTareas();\n    taskInput.focus();\n    console.log('Aplicación de Tareas inicializada');\n    console.log(`${tareas.length} tareas cargadas desde el almacenamiento local`);\n}\n\n// Iniciar la aplicación cuando el DOM esté listo\nif (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', inicializar);\n} else {\n    inicializar();\n}