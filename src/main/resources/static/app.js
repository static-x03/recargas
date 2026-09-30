const $ = (selector) => document.querySelector(selector);
const api = async (path, options = {}) => {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  if (!response.ok) {
    let detail = '';
    try { const body = await response.json(); detail = body.message || body.error || ''; } catch { detail = await response.text(); }
    throw new Error(detail || `No se pudo completar la solicitud (${response.status}).`);
  }
  if (response.status === 204) return null;
  return response.json();
};
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const money = (amount) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 2 }).format(Number(amount) || 0);
const date = (value) => { if (!value) return '—'; const parsed = Array.isArray(value) ? new Date(value[0], value[1] - 1, value[2], value[3] || 0, value[4] || 0, value[5] || 0) : new Date(value); return Number.isNaN(parsed.getTime()) ? '—' : new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(parsed); };
const setMessage = (element, text, success = false) => { element.textContent = text; element.className = `message ${success ? 'success' : 'failure'}`; };
let users = [];
let operators = [];
let recharges = [];

function renderEntities(list, values, select, emptyText) {
  list.innerHTML = values.length ? values.map((item) => `<li><span>${escapeHtml(item.nombre)}</span><small>#${item.id}</small></li>`).join('') : '';
  select.innerHTML = `<option value="">${emptyText}</option>` + values.map((item) => `<option value="${item.id}">${escapeHtml(item.nombre)}</option>`).join('');
}

function renderRecharges() {
  $('#total-recharges').textContent = recharges.length;
  $('#recharge-list').innerHTML = recharges.length ? [...recharges].reverse().slice(0, 8).map((item) => `<tr><td>${escapeHtml(item.numero)}</td><td>${escapeHtml(item.usuario?.nombre || '—')}</td><td>${escapeHtml(item.operador?.nombre || '—')}</td><td>${escapeHtml(date(item.fecha))}</td><td class="align-right"><strong>${escapeHtml(money(item.valor))}</strong></td></tr>`).join('') : '<tr><td colspan="5" class="empty-state">Todavía no hay recargas registradas.</td></tr>';
}

async function loadData() {
  try {
    const [loadedUsers, loadedOperators, loadedRecharges] = await Promise.all([api('/usuarios'), api('/operadores'), api('/recargas')]);
    users = loadedUsers; operators = loadedOperators; recharges = loadedRecharges;
    $('#total-users').textContent = users.length; $('#total-operators').textContent = operators.length;
    renderEntities($('#user-list'), users, $('#user-select'), 'Selecciona un usuario');
    renderEntities($('#operator-list'), operators, $('#operator-select'), 'Selecciona un operador');
    renderRecharges();
  } catch (error) {
    $('#recharge-list').innerHTML = `<tr><td colspan="5" class="empty-state">${escapeHtml(error.message)} Revisa la conexión con el servidor.</td></tr>`;
    $('#total-users').textContent = '—'; $('#total-operators').textContent = '—'; $('#total-recharges').textContent = '—';
  }
}

function validateName(input, errorNode) {
  const value = input.value.trim();
  let message = '';
  if (!value) message = 'Este campo es obligatorio.';
  else if (value.length < 2) message = 'Escribe al menos 2 caracteres.';
  else if (value.length > 80) message = 'Usa máximo 80 caracteres.';
  else if (!/^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u.test(value)) message = 'Usa solo letras, espacios, puntos o guiones.';
  input.classList.toggle('invalid', Boolean(message)); errorNode.textContent = message;
  return !message;
}

$('#recharge-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const phone = $('#phone'); const amount = $('#amount');
  const digits = phone.value.trim();
  const phoneError = !/^\d{7,15}$/.test(digits) ? 'Ingresa un número de 7 a 15 dígitos.' : '';
  const number = Number(amount.value);
  const amountError = !Number.isFinite(number) || number <= 0 ? 'Ingresa un valor numérico mayor que cero.' : '';
  const userError = !$('#user-select').value ? 'Selecciona un usuario.' : '';
  const operatorError = !$('#operator-select').value ? 'Selecciona un operador.' : '';
  [[phone, '#phone-error', phoneError], [amount, '#amount-error', amountError], [$('#user-select'), '#user-error', userError], [$('#operator-select'), '#operator-error', operatorError]].forEach(([input, selector, message]) => { input.classList.toggle('invalid', Boolean(message)); $(selector).textContent = message; });
  if (phoneError || amountError || userError || operatorError) return;
  const button = event.submitter; button.disabled = true;
  try {
    await api('/recargas', { method: 'POST', body: JSON.stringify({ numero: digits, valor: number, usuario: { id: Number($('#user-select').value) }, operador: { id: Number($('#operator-select').value) } }) });
    setMessage($('#recharge-message'), 'Recarga registrada correctamente.', true);
    form.reset(); await loadData();
  } catch (error) { setMessage($('#recharge-message'), error.message); }
  finally { button.disabled = false; }
});

async function addEntity(form, input, errorNode, messageNode, endpoint, listSelector, selectSelector, emptyText) {
  if (!validateName(input, errorNode)) return;
  const button = form.querySelector('button[type="submit"]'); button.disabled = true;
  try {
    await api(endpoint, { method: 'POST', body: JSON.stringify({ nombre: input.value.trim() }) });
    setMessage(messageNode, 'Registro agregado correctamente.', true); form.reset(); await loadData();
  } catch (error) { setMessage(messageNode, error.message); }
  finally { button.disabled = false; }
}

$('#user-form').addEventListener('submit', (event) => { event.preventDefault(); addEntity(event.currentTarget, $('#user-name'), $('#user-name-error'), $('#user-message'), '/usuarios', '#user-list', '#user-select', 'Selecciona un usuario'); });
$('#operator-form').addEventListener('submit', (event) => { event.preventDefault(); addEntity(event.currentTarget, $('#operator-name'), $('#operator-name-error'), $('#operator-message'), '/operadores', '#operator-list', '#operator-select', 'Selecciona un operador'); });
$('#user-name').addEventListener('input', () => validateName($('#user-name'), $('#user-name-error')));
$('#operator-name').addEventListener('input', () => validateName($('#operator-name'), $('#operator-name-error')));
$('#phone').addEventListener('input', () => { $('#phone').value = $('#phone').value.replace(/[^\d]/g, '').slice(0, 15); $('#phone').classList.remove('invalid'); $('#phone-error').textContent = ''; });
$('#amount').addEventListener('input', () => { $('#amount').classList.remove('invalid'); $('#amount-error').textContent = ''; });
$('#user-select').addEventListener('change', () => { $('#user-select').classList.remove('invalid'); $('#user-error').textContent = ''; });
$('#operator-select').addEventListener('change', () => { $('#operator-select').classList.remove('invalid'); $('#operator-error').textContent = ''; });
$('#refresh-button').addEventListener('click', loadData);
loadData();
