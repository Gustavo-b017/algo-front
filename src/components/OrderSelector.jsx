
import React from "react";

function OrderSelector({ order, setOrder }) {
  return (
    <div className="col-md-2">
      <label className="form-label">Ordem:</label>
      <select
        className="form-select"
        value={order}
        onChange={e => setOrder(e.target.value)}
      >
        <option value="asc">Crescente</option>
        <option value="desc">Decrescente</option>
      </select>
    </div>
  );
}

export default OrderSelector;
