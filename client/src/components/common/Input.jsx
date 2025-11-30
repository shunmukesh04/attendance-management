const Input = ({ label, type = 'text', name, value, onChange, placeholder, required, error }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      {label && (
        <label className="label">
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        className="input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {error && <div style={{ color: 'red', fontSize: '14px', marginTop: '4px' }}>{error}</div>}
    </div>
  );
};

export default Input;

