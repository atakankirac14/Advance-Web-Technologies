import "./HomeScreen.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Fuse from "fuse.js";

// Components
import Product from "../components/Product";

//Actions
import { getProducts as listProducts } from "../redux/actions/productActions";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [value, setValue] = useState([]);

  const getProducts = useSelector((state) => state.getProducts);
  const { products, loading, error } = getProducts;

  const options = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    distance: 50,
    maxPatternLength: 12,
    keys: ["name"],
  };

  const fuse = new Fuse(products, options);

  const handleSearch = (e) => {
    setValue(e.target.value);
    const newList = value ? fuse.search(value) : products;
    const modifiedList = newList.map((e) => (e.item ? e.item : e));
    setList(modifiedList);
  };

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  useEffect(() => {
    setList(products);
  }, [products]);

  const priceFilter = (type) => {
    if (type === "low") {
      const myData = []
        .concat(list)
        .sort((a, b) => (a.price > b.price ? 1 : -1));
      setList(myData);
    } else {
      const myData = []
        .concat(list)
        .sort((a, b) => (a.price < b.price ? 1 : -1));
      setList(myData);
    }
  };

  return (
    <div className="homescreen">
      <h2 className="homescreen__title">Latest Products</h2>
      <input
        type="text"
        className="search-input"
        placeholder="Search"
        value={value}
        onChange={handleSearch}
      />
      <button className="btn-sort" onClick={() => priceFilter("low")}>
       Lowest to highest
      </button>
      <button className="btn-sort" onClick={() => priceFilter("high")}>
        Highest to lowest
      </button>
      <div className="homescreen__products">
        {loading ? (
          <h2>Loading...</h2>
        ) : error ? (
          <h2>{error}</h2>
        ) : (
          list.map((product) => (
            <Product
              key={product._id}
              name={product.name}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl}
              productId={product._id}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
