import './styles.css';

export const Select = ({ options = [], onChange, value, name, label }) => {
    return <div className="select-input">
        <label>{label}</label>
        <select name={name} value={value} onChange={onChange}>
            {options.map(d => (
                <option key={d.label} value={d.value}>{d.label}</option>
            ))}
        </select>
    </div>
}
