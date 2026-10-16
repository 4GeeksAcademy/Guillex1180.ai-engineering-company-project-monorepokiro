/* ==========================================================================
   TrackFlow — Hito 1 | validation.js
   Validación en JS puro del formulario de captación de leads (#lead-form)
   Fuente única de verdad: CONTEXT.es.md
   ========================================================================== */

(function () {
  'use strict';

  var MAX_COMMENTS = 500;

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('lead-form');
    if (!form) return;

    /* ----- Referencias a los campos ----- */
    var companyName   = document.getElementById('company-name');
    var contactPerson = document.getElementById('contact-person');
    var email         = document.getElementById('email');
    var phone         = document.getElementById('phone');
    var website       = document.getElementById('website');
    var country       = document.getElementById('country');
    var productType   = document.getElementById('product-type');
    var monthlyVolume = document.getElementById('monthly-volume');
    var services      = document.querySelectorAll('input[name="services"]');
    var current3pl    = document.querySelectorAll('input[name="current-3pl"]');
    var comments      = document.getElementById('comments');
    var privacy       = document.getElementById('privacy');
    var charCounter   = document.getElementById('char-counter');
    var volumeWarning = document.getElementById('volume-warning');
    var successMessage = document.getElementById('success-message');

    /* ----- Utilidades de errores ----- */
    function fieldErrorId(input) {
      return input.id + '-error';
    }

    function setError(input, message) {
      var errorEl = document.getElementById(fieldErrorId(input));
      input.classList.add('input-error');
      if (errorEl) {
        errorEl.textContent = message;
      }
    }

    function clearError(input) {
      var errorEl = document.getElementById(fieldErrorId(input));
      input.classList.remove('input-error');
      if (errorEl) {
        errorEl.textContent = '';
      }
    }

    function setGroupError(name, errorId, message) {
      var errorEl = document.getElementById(errorId);
      document.querySelectorAll('input[name="' + name + '"]').forEach(function (el) {
        el.classList.add('input-error');
      });
      if (errorEl) {
        errorEl.textContent = message;
      }
    }

    function clearGroupError(name, errorId) {
      var errorEl = document.getElementById(errorId);
      document.querySelectorAll('input[name="' + name + '"]').forEach(function (el) {
        el.classList.remove('input-error');
      });
      if (errorEl) {
        errorEl.textContent = '';
      }
    }

    /* ----- Validaciones individuales (formato) ----- */
    function isValidEmail(value) {
      // Debe contener @ y dominio
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }

    function isValidPhone(value) {
      // Debe comenzar con + seguido del código de país
      return /^\+\d{1,4}([\s.-]\d+)+$/.test(value);
    }

    function isValidUrl(value) {
      // Debe comenzar con http:// o https://
      return /^https?:\/\/\S+\.\S+/.test(value);
    }

    /* ----- Contador de caracteres en tiempo real ----- */
    function updateCharCounter() {
      var remaining = MAX_COMMENTS - comments.value.length;
      if (remaining < 0) remaining = 0;
      charCounter.textContent = 'Quedan ' + remaining + ' caracteres';

      var errorEl = document.getElementById('comments-error');
      if (comments.value.length > MAX_COMMENTS) {
        setError(comments, 'Los comentarios no pueden exceder 500 caracteres (quedan ' + remaining + ')');
      } else if (errorEl && errorEl.textContent) {
        clearError(comments);
      }
    }

    comments.addEventListener('input', updateCharCounter);

    /* ----- Mostrar/ocultar advertencia para volumen "0-100" ----- */
    function updateVolumeWarning() {
      var show = monthlyVolume.value === '0-100';
      volumeWarning.classList.toggle('hidden', !show);

      // Envía la advertencia al lector de pantalla en cuanto aparece
      if (show) {
        volumeWarning.setAttribute('role', 'alert');
      } else {
        volumeWarning.removeAttribute('role');
      }
    }

    monthlyVolume.addEventListener('change', updateVolumeWarning);

    /* ----- Validación completa al hacer submit ----- */
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var valid = true;

      /* 1. Nombre de la empresa: mínimo 2 caracteres */
      if (companyName.value.trim().length < 2) {
        setError(companyName, 'El nombre de la empresa debe tener al menos 2 caracteres');
        valid = false;
      } else {
        clearError(companyName);
      }

      /* 2. Persona de contacto: nombre y apellido (mínimo 2 palabras) */
      if (contactPerson.value.trim().split(/\s+/).filter(Boolean).length < 2) {
        setError(contactPerson, 'Ingresa nombre y apellido del contacto');
        valid = false;
      } else {
        clearError(contactPerson);
      }

      /* 3. Email corporativo: formato válido */
      if (!isValidEmail(email.value.trim())) {
        setError(email, 'Ingresa un email corporativo válido (ejemplo: nombre@empresa.com)');
        valid = false;
      } else {
        clearError(email);
      }

      /* 4. Teléfono: +código de país + número */
      if (!isValidPhone(phone.value.trim())) {
        setError(phone, 'El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)');
        valid = false;
      } else {
        clearError(phone);
      }

      /* 5. Sitio web: opcional, si se incluye debe ser URL válida */
      if (website.value.trim() !== '' && !isValidUrl(website.value.trim())) {
        setError(website, 'Si incluyes sitio web, debe ser una URL válida');
        valid = false;
      } else {
        clearError(website);
      }

      /* 6. País de operación principal */
      if (country.value === '') {
        setError(country, 'Selecciona el país de operación principal');
        valid = false;
      } else {
        clearError(country);
      }

      /* 7. Tipo de producto */
      if (productType.value === '') {
        setError(productType, 'Selecciona el tipo de producto que manejas');
        valid = false;
      } else {
        clearError(productType);
      }

      /* 8. Volumen mensual estimado */
      if (monthlyVolume.value === '') {
        setError(monthlyVolume, 'Selecciona el volumen mensual estimado');
        valid = false;
      } else {
        clearError(monthlyVolume);
      }

      /* 9. Servicios de interés: al menos uno */
      var servicesChecked = Array.prototype.some.call(services, function (el) { return el.checked; });
      if (!servicesChecked) {
        setGroupError('services', 'services-error', 'Selecciona al menos un servicio de interés');
        valid = false;
      } else {
        clearGroupError('services', 'services-error');
      }

      /* 10. 3PL actual */
      var current3plChecked = Array.prototype.some.call(current3pl, function (el) { return el.checked; });
      if (!current3plChecked) {
        setGroupError('current-3pl', 'current-3pl-error', 'Indica si actualmente trabajas con otro proveedor logístico');
        valid = false;
      } else {
        clearGroupError('current-3pl', 'current-3pl-error');
      }

      /* 11. Comentarios: máximo 500 caracteres (opcional) */
      if (comments.value.length > MAX_COMMENTS) {
        setError(comments, 'Los comentarios no pueden exceder 500 caracteres (quedan ' + (MAX_COMMENTS - comments.value.length) + ')');
        valid = false;
      } else {
        clearError(comments);
      }

      /* 12. Política de privacidad: debe estar marcada */
      if (!privacy.checked) {
        setError(privacy, 'Debes aceptar la política de privacidad para continuar');
        valid = false;
      } else {
        clearError(privacy);
      }

      /* ----- Envío exitoso (simulado): ocultar form, mostrar éxito ----- */
      if (valid) {
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        var firstError = form.querySelector('.input-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          (firstError.focus ? firstError : form.querySelector('input, select, textarea')).focus();
        }
      }
    });

    /* ----- Limpiar el error del campo en cuanto el usuario corrige ----- */
    var fields = [companyName, contactPerson, email, phone, website, country, productType, monthlyVolume, comments, privacy];
    fields.forEach(function (field) {
      if (!field) return;
      field.addEventListener('input', function () { clearError(field); });
      field.addEventListener('change', function () { clearError(field); });
    });

    // Inicializar contador y advertencia al cargar
    updateCharCounter();
    updateVolumeWarning();
  });
})();