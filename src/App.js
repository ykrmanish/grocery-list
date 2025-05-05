import { useEffect, useState } from "react";

function App() {
  const [items, setItems] = useState(() => {
    const storedItems = localStorage.getItem("groceryItems");
    return storedItems ? JSON.parse(storedItems) : [];
  });

  useEffect(() => {
    localStorage.setItem("groceryItems", JSON.stringify(items));
  }, [items]);

  function handleSetItem(item) {
    setItems([...items, item]);
  }

  function handlePackedItems(id) {
    setItems((itemObj) =>
      [...itemObj].map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : { ...item }
      )
    );
  }

  function handleDeleteItems(id) {
    setItems((itemObj) => itemObj.filter((item) => item.id !== id));
  }

  function handleClearItems() {
    const userInput = window.confirm("Do you want to clear all items?");
    if (!userInput) return;
    setItems([]);
  }

  return (
    <div>
      <Logo />
      <Form onAddItem={handleSetItem} />
      <GroceryList
        items={items}
        onPackedItem={handlePackedItems}
        onDeleteItem={handleDeleteItems}
        onClearItems={handleClearItems}
      />
      <Footer items={items} />
    </div>
  );
}

function Logo() {
  return (
    <div className="logo">
      <p>🍅</p>
      <h1>GROCERY&nbsp;&nbsp;&nbsp;LIST</h1>
      <p>🫑</p>
    </div>
  );
}

function Form({ onAddItem }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");

  function handleAddItem(e) {
    e.preventDefault();
    if (!description) return;
    const newItem = {
      description,
      quantity,
      unit,
      packed: false,
      id: Date.now() + Math.floor(Math.random() * 1000),
      key: Date.now() + Math.floor(Math.random() * 1000),
    };
    onAddItem(newItem);
    setDescription("");
    setQuantity("");
    setUnit("");
  }

  return (
    <form className="form" onSubmit={(e) => handleAddItem(e)}>
      <input
        className="form-input"
        placeholder="quantity..."
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      ></input>
      <select
        className="form-input"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      >
        <option value="">None</option>
        <option value="Kg">Kilograms</option>
        <option value="Gm">Grams</option>
        <option value="Dz">Dozen</option>
        <option value="Packet">Packet</option>
      </select>
      <input
        style={{ width: "300px" }}
        className="form-input"
        placeholder="item name..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></input>
      <button className="form-input btn">Add</button>
    </form>
  );
}

function GroceryList({ items, onPackedItem, onDeleteItem, onClearItems }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems = [...items];

  function sortItem(e) {
    const value = e.target.value;
    setSortBy(value);
  }
  if (sortBy === "input") sortedItems = [...items];
  if (sortBy === "description")
    sortedItems = [...items].sort((a, b) =>
      a.description.localeCompare(b.description)
    );
  if (sortBy === "quantity")
    sortedItems = [...items].sort(
      (a, b) => Number(b.quantity) - Number(a.quantity)
    );
  return (
    <div className="grocery-list">
      <ul className="items">
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.key}
            onPackedItem={onPackedItem}
            onDeleteItem={onDeleteItem}
          />
        ))}
      </ul>

      <div className="action">
        <select className="sort" onChange={(e) => sortItem(e)}>
          <option value="input">Sort by input order</option>
          <option value="description">Sort by description</option>
          <option value="quantity">Sort by quantity</option>
        </select>
        <button className="clear" onClick={onClearItems}>
          Clear All
        </button>
      </div>
    </div>
  );
}

function Item({ item, onPackedItem, onDeleteItem }) {
  return (
    <li className="item">
      <input
        type="checkbox"
        checked={item.packed}
        onChange={() => onPackedItem(item.id)}
      ></input>
      <p style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.description}{" "}
        {item.quantity ? `- ${item.quantity} ${item.unit}` : ""}
      </p>
      <span onClick={() => onDeleteItem(item.id)}>✖️</span>
    </li>
  );
}

function Footer({ items }) {
  const numItems = items.length;
  const itemsPacked = [...items].filter((item) => item.packed).length;
  const percentage = Math.round((itemsPacked / numItems) * 100);

  if (!numItems) {
    return (
      <div className="footer">
        <p>Start making grocery list🍅🍆🫛🫑🥕</p>
      </div>
    );
  }

  if (percentage === 100) {
    return (
      <div className="footer">
        <p>You basket is ready. 🧺</p>
      </div>
    );
  }

  return (
    <div className="footer">
      <p>
        You have {numItems} {numItems > 1 ? "items" : "item"} in your grocery
        list. {itemsPacked} {itemsPacked > 1 ? "items" : "item"}({percentage}%)
        packed.
      </p>
    </div>
  );
}

export default App;
