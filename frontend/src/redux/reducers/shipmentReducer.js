const initialState = {
  shipments: [],
  error: null
};

const shipmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_SHIPMENTS_SUCCESS':
      return { ...state, shipments: action.payload };
    case 'FETCH_SHIPMENTS_FAIL':
      return { ...state, error: action.payload };
    case 'ADD_SHIPMENT_SUCCESS':
      return { ...state, shipments: [...state.shipments, action.payload] };
    case 'ADD_SHIPMENT_FAIL':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default shipmentReducer;
