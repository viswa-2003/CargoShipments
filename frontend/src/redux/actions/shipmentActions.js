import axios from 'axios';

export const fetchShipments = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/shipments');
    dispatch({ type: 'FETCH_SHIPMENTS_SUCCESS', payload: res.data });
  } catch (err) {
    dispatch({ type: 'FETCH_SHIPMENTS_FAIL', payload: err.message });
  }
};

export const addShipment = (shipmentData) => async (dispatch) => {
  try {
    const res = await axios.post('/api/shipment', shipmentData);
    dispatch({ type: 'ADD_SHIPMENT_SUCCESS', payload: res.data });
  } catch (err) {
    dispatch({ type: 'ADD_SHIPMENT_FAIL', payload: err.message });
  }
};
