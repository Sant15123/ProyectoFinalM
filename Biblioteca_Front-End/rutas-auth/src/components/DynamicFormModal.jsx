// src/components/DynamicFormModal.jsx
import React, { useState, useEffect } from 'react';

const DynamicFormModal = ({
  isOpen,
  onClose,
  onSave,
  title,
  subtitle,
  fields,
  initialData,
  loading = false
}) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Inicializar datos del formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({ ...initialData });
      setErrors({});
    }
  }, [isOpen, initialData]);

  // Manejar cambios en los campos
  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Limpiar error del campo si existe
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name].toString().trim() === '')) {
        newErrors[field.name] = `${field.label} es requerido`;
      }

      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          newErrors[field.name] = 'Email inválido';
        }
      }

      if (field.type === 'number' && formData[field.name]) {
        const num = parseFloat(formData[field.name]);
        if (isNaN(num)) {
          newErrors[field.name] = 'Debe ser un número válido';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  // Renderizar campo individual
  const renderField = (field) => {
    const baseProps = {
      id: field.name,
      value: formData[field.name] || '',
      onChange: (e) => handleChange(field.name, e.target.value),
      disabled: loading,
      className: errors[field.name] ? 'error' : ''
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...baseProps}
            rows={field.rows || 4}
            placeholder={field.placeholder}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '0.75rem',
              border: `2px solid ${errors[field.name] ? '#f44336' : '#bcaaa4'}`,
              borderRadius: '6px',
              backgroundColor: '#fff8e1',
              fontSize: '1rem',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        );

      case 'select':
        return (
          <select
            {...baseProps}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '0.75rem',
              border: `2px solid ${errors[field.name] ? '#f44336' : '#bcaaa4'}`,
              borderRadius: '6px',
              backgroundColor: '#fff8e1',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'array':
        const arrayValue = Array.isArray(formData[field.name])
          ? formData[field.name]
          : (formData[field.name] ? formData[field.name].split(',').map(item => item.trim()).filter(item => item) : []);

        return (
          <div>
            <input
              type="text"
              value={arrayValue.join(', ')}
              onChange={(e) => {
                const value = e.target.value.split(',').map(item => item.trim()).filter(item => item);
                handleChange(field.name, value);
              }}
              placeholder={field.placeholder}
              disabled={loading}
              style={{
                width: '100%',
                maxWidth: '400px',
                padding: '0.75rem',
                border: `2px solid ${errors[field.name] ? '#f44336' : '#bcaaa4'}`,
                borderRadius: '6px',
                backgroundColor: '#fff8e1',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />
            <small style={{ color: '#8d6e63', fontSize: '0.8rem' }}>
              {field.helpText || 'Separar elementos con comas'}
            </small>
          </div>
        );

      default:
        return (
          <input
            type={field.type || 'text'}
            {...baseProps}
            placeholder={field.placeholder}
            style={{
              width: '100%',
              maxWidth: '400px',
              padding: '0.75rem',
              border: `2px solid ${errors[field.name] ? '#f44336' : '#bcaaa4'}`,
              borderRadius: '6px',
              backgroundColor: '#fff8e1',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
        );
    }
  };

  // Organizar campos en grid dinámico
  const organizeFields = () => {
    const rows = [];
    let currentRow = [];
    let currentRowSpan = 0;

    fields.forEach((field, index) => {
      const span = field.gridSpan || 1;

      // Si agregar este campo excede el ancho de fila (2), crear nueva fila
      if (currentRowSpan + span > 2) {
        if (currentRow.length > 0) {
          rows.push(currentRow);
          currentRow = [];
          currentRowSpan = 0;
        }
      }

      currentRow.push(field);
      currentRowSpan += span;

      // Si es el último campo, agregar la fila actual
      if (index === fields.length - 1 && currentRow.length > 0) {
        rows.push(currentRow);
      }
    });

    return rows;
  };

  if (!isOpen) return null;

  const fieldRows = organizeFields();

  return (
    <div className="detail-modal-overlay">
      <div className="detail-modal-content">
        <div className="detail-modal-header">
          <h2 className="detail-modal-title">{title}</h2>
          {subtitle && <p className="detail-modal-subtitle">{subtitle}</p>}
        </div>

        <div className="detail-modal-body">
          <form onSubmit={handleSubmit}>
            {fieldRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                style={{
                  display: 'grid',
                  gridTemplateColumns: row.length === 1 ? '1fr' : '1fr 1fr',
                  gap: '2.5rem',
                  alignItems: 'start',
                  marginBottom: '2rem',
                  padding: '0.5rem 0'
                }}
              >
                {row.map(field => (
                  <div key={field.name} style={{ marginBottom: '1rem' }}>
                    <label htmlFor={field.name} style={{
                      display: 'block',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#5d4037'
                    }}>
                      {field.label}
                      {field.required && <span style={{ color: '#f44336' }}> *</span>}
                    </label>
                    {renderField(field)}
                    {errors[field.name] && (
                      <span style={{
                        color: '#f44336',
                        fontSize: '0.8rem',
                        marginTop: '0.25rem',
                        display: 'block'
                      }}>
                        {errors[field.name]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </form>
        </div>

        <div className="detail-modal-actions">
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ marginRight: '1rem' }}
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="detail-modal-close-btn"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicFormModal;