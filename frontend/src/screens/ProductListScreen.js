import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    createProduct,
    deleteProduct,
    listProducts,
  } from '../actions/productActions';import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {
    PRODUCT_CREATE_RESET,
    PRODUCT_DELETE_RESET,
  } from '../constants/productConstants';

export default function ProductListScreen(props) {
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const productDelete = useSelector((state) => state.productDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = productDelete;

  const dispatch = useDispatch();
  useEffect(() => {
    if (successCreate) {
        dispatch({ type: PRODUCT_CREATE_RESET });
        props.history.push(`/product/${createdProduct._id}/edit`);
      }
    if (successDelete) {
        dispatch({ type: PRODUCT_DELETE_RESET });
      }
    dispatch(listProducts());
}, [createdProduct, dispatch, props.history, successCreate, successDelete]);

const deleteHandler = (product) => {
  if (window.confirm('Are you sure to delete?')) {
    dispatch(deleteProduct(product._id));
  }
  };
  const createHandler = () => {
    dispatch(createProduct());
  };
  return (
    <div>
        <div className="title">Dogs For Sale</div>
{/* Create Product Button */}
        <button type="button" className="primary" onClick={createHandler}>
          ADD A DOGGO
        </button>

      {loadingDelete && <LoadingBox></LoadingBox>}
      {errorDelete && <MessageBox variant="danger">{errorDelete}</MessageBox>}
      
{/* Loading and Error */}
      {loadingCreate && <LoadingBox></LoadingBox>}
      {errorCreate && <MessageBox variant="danger">{errorCreate}</MessageBox>}
{/* LoadingBox and Error MessageBox */}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>PRICE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>
{/* Edit Button */}
                  <button
                    type="button"
                    className="small brown"
                    onClick={() =>
                      props.history.push(`/product/${product._id}/edit`)
                    }
                  >
                    EDIT
                  </button>
{/* Delete Button */}
                  <button
                    type="button"
                    className="small"
                    onClick={() => deleteHandler(product)}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}