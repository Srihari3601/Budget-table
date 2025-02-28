import React, { useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState([
    {
      id: "electronics",
      label: "Electronics",
      value: 1500,
      originalValue: 1500,
      variance: 0,
      input: "",
      children: [
        { id: "phones", label: "Phones", value: 800, originalValue: 800, variance: 0, input: "" },
        { id: "laptops", label: "Laptops", value: 700, originalValue: 700, variance: 0, input: "" },
      ],
    },
    {
      id: "furniture",
      label: "Furniture",
      value: 1000,
      originalValue: 1000,
      variance: 0,
      input: "",
      children: [
        { id: "tables", label: "Tables", value: 300, originalValue: 300, variance: 0, input: "" },
        { id: "chairs", label: "Chairs", value: 700, originalValue: 700, variance: 0, input: "" },
      ],
    },
  ]);

  const handleUserInputChange = (id, newInput) => {
    updateData(id, newInput, "input");
  };

  const handleAllocationIncrease = (id, percentage) => {
    updateData(id, (prevValue) => Math.round(prevValue * (1 + percentage / 100)), "value");
  };

  const handleAllocationValue = (id, newValue) => {
    updateData(id, Number(newValue), "value");
  };

  const updateData = (id, newValueFunc, field) => {
    const updatedData = data.map((item) => {
      if (item.id === id) {
        const newValue = typeof newValueFunc === "function" ? newValueFunc(item[field]) : newValueFunc;
        const variance = ((newValue - item.originalValue) / item.originalValue) * 100;
        
        if (item.children && field === "value") {
          const totalOriginal = item.children.reduce((sum, child) => sum + child.originalValue, 0);
          const updatedChildren = item.children.map((child) => {
            const contributionPercent = child.originalValue / totalOriginal;
            const updatedChildValue = parseFloat((newValue * contributionPercent).toFixed(4));
            const childVariance = ((updatedChildValue - child.originalValue) / child.originalValue) * 100;
            return { ...child, value: updatedChildValue, variance: childVariance.toFixed(2) };
          });
  
          return { ...item, children: updatedChildren, value: newValue, variance: variance.toFixed(2) };
        }
  
        return { ...item, [field]: newValue, variance: variance.toFixed(2) };
      }
  
      if (item.children) {
        const updatedChildren = item.children.map((child) => {
          if (child.id === id) {
            const newValue = typeof newValueFunc === "function" ? newValueFunc(child[field]) : newValueFunc;
            const variance = ((newValue - child.originalValue) / child.originalValue) * 100;
            return { ...child, [field]: newValue, variance: variance.toFixed(2) };
          }
          return child;
        });
  
        const newTotal = updatedChildren.reduce((sum, child) => sum + child.value, 0);
        const parentVariance = ((newTotal - item.originalValue) / item.originalValue) * 100;
  
        return { ...item, children: updatedChildren, value: newTotal, variance: parentVariance.toFixed(2) };
      }
  
      return item;
    });
  
    setData(updatedData);
  };
  
  

  return (
    <div>
      <h1 className="heading">Budget Allocation Table</h1>
      <table border="1">
        <thead>
          <tr>
            <th style={{ width: "200px" }}>Label</th>
            <th style={{ width: "100px" }}>Value</th>
            <th style={{ width: "100px" }}>Input</th>
            <th style={{ width: "100px" }}>Allocation %</th>
            <th style={{ width: "100px" }}>Allocation Val</th>
            <th style={{ width: "100px" }}>Variance (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <React.Fragment key={item.id}>
              {/* Parent Row */}
              <TableRow
                className="parent-row"
                label={item.label}
                value={item.value}
                input={item.input}
                variance={item.variance}
                onUserInputChange={(input) => handleUserInputChange(item.id, input)}
                onApplyPercentage={() => handleAllocationIncrease(item.id, Number(item.input))}
                onApplyValue={() => handleAllocationValue(item.id, Number(item.input))}
              />

              {/* Child Rows */}
              {item.children &&
                item.children.map((child) => (
                  <TableRow
                    className="child-row"
                    key={child.id}
                    label={`-- ${child.label}`}
                    value={child.value}
                    input={child.input}
                    variance={child.variance}
                    onUserInputChange={(input) => handleUserInputChange(child.id, input)}
                    onApplyPercentage={() => handleAllocationIncrease(child.id, Number(child.input))}
                    onApplyValue={() => handleAllocationValue(child.id, Number(child.input))}
                  />
                ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({ label, value, input, variance, onUserInputChange, onApplyPercentage, onApplyValue }) {
  return (
    <tr>
      <td><strong>{label}</strong></td>
      <td><strong>{value}</strong></td>
      <td>
        <input type="text" value={input} onChange={(e) => onUserInputChange(e.target.value)} />
      </td>
      <td>
        <button onClick={onApplyPercentage}>Apply %</button>
      </td>
      <td>
        <button onClick={onApplyValue}>Apply Val</button>
      </td>
      <td>{variance !== undefined ? `${variance}%` : "-"}</td>
    </tr>
  );
}

export default App;