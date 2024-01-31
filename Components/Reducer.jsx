import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { useMutation, useQuery } from "react-query";
import Swal from "sweetalert2";
import Pagination from "@mui/material/Pagination";
import InputLabel from "@mui/material/InputLabel";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import * as yup from "yup";
import AddEdit from "./AddEdit";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const initialValues = {
  data: [],
  isOpenAddEditModal: false,
  addNewData: {
    idx: "",
    fname: "",
    lname: "",
  },
  modalAction: "",
  page: 1,
  errors: {},
  pageSize: 10,
  filter: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "GET":
      return { ...state, data: action.payload };
    case "ADDEDITMODAL":
      return { ...state, isOpenAddEditModal: action.payload };
    case "ADDFIELDS":
      return {
        ...state,
        addNewData: { ...state.addNewData, [action.field]: action.value },
      };
    case "MODALACTION":
      return { ...state, modalAction: action.payload };
    case "PAGE":
      return { ...state, page: action.payload };
    case "ERROR":
      return { ...state, errors: action.payload };
    case "PAGESIZE":
      return { ...state, pageSize: action.payload };
    case "FILTER":
      return { ...state, filter: action.payload };
    default:
      return state;
  }
};

const pageSizes = [5, 10, 20, 50, 100, 500];

const Reducer = () => {
  const [values, dispatch] = useReducer(reducer, initialValues);

  const handleChange = (event) => {
    dispatch({ type: "PAGESIZE", payload: event.target.value });
  };
  const schema = yup.object().shape({
    fname: yup.string().required("This feild is required"),
    lname: yup.string().required("This field is required"),
  });

  const isValid = async () => {
    try {
      await schema.validate(values.addNewData, { abortEarly: false });
      return true;
    } catch (error) {
      const newErrors = {};
      error.inner.forEach((e) => {
        newErrors[e.path] = e.message;
      });
      dispatch({ type: "ERROR", payload: newErrors });
      return false;
    }
  };

  const { data: isLoadedData, refetch } = useQuery("get", () =>
    axios
      .get(
        `http://localhost:3002/api/getapi?page=${values.page},${values.pageSize}`,
        {
          params: {
            filter: values.filter,
          },
        }
      )
      .then((res) => res.data)
  );

  const { data: isDelete, mutate: deletemethod } = useMutation(
    "delete",
    ({ idx }) =>
      axios
        .delete(`http://localhost:3002/api/deleteapi?idx=${idx}`)
        .then((res) => res.data.data)
  );

  useEffect(() => {
    if (isDelete) {
      if (isDelete === "success") {
        refetch();
        Toast.fire({
          icon: "success",
          title: "Data deleted successfully",
        });
      }
    }
  }, [isDelete]);

  useEffect(() => {
    if (isLoadedData) {
      dispatch({ type: "GET", payload: isLoadedData.data });
    }
  }, [isLoadedData]);

  useEffect(() => {
    refetch();
  }, [values.page, values.pageSize, values.filter]);

  const handleDelete = (idx) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deletemethod({ idx: idx });
      }
    });
  };

  const handleAddButton = () => {
    dispatch({ type: "ADDEDITMODAL", payload: true });
    dispatch({
      type: "ADDFIELDS",
      field: "fname",
      value: "",
    });
    dispatch({
      type: "ADDFIELDS",
      field: "lname",
      value: "",
    });
    dispatch({
      type: "ADDFIELDS",
      field: "idx",
      value: "",
    });
    dispatch({
      type: "MODALACTION",
      payload: "add",
    });
  };

  return (
    <div>
      <AddEdit
        values={values}
        dispatch={dispatch}
        refetch={refetch}
        isValid={isValid}
      />
      <div>
        <button
          className="btn btn-success"
          style={{ marginLeft: "200px", marginTop: "20px" }}
          onClick={handleAddButton}
        >
          Add New
        </button>

        <Pagination
          count={isLoadedData && isLoadedData.pagesize}
          color="primary"
          onChange={(e, pg) => dispatch({ type: "PAGE", payload: pg })}
          style={{ marginTop: "-30px" }}
        />
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">
            Page Size
          </InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={values.pageSize}
            onChange={handleChange}
            label="Page size"
          >
            {pageSizes.map((item) => (
              <MenuItem value={item}>{item}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          variant="standard"
          style={{ margin: "9px 0px 0px 20px" }}
          label="Search"
          value={values.filter}
          onChange={(e) =>
            dispatch({ type: "FILTER", payload: e.target.value })
          }
        />
      </div>
      <table className="table table-hover">
        <thead>
          <th>Idx</th>
          <th>Fname</th>
          <th>Lname</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {values.data &&
            values.data.map((item) => (
              <tr key={item.idx}>
                <td>{item.idx}</td>
                <td>{item.name}</td>
                <td>{item.sname}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    style={{ marginRight: "10px" }}
                    onClick={() => {
                      dispatch({ type: "ADDEDITMODAL", payload: true });
                      dispatch({
                        type: "ADDFIELDS",
                        field: "fname",
                        value: item.name,
                      });
                      dispatch({
                        type: "ADDFIELDS",
                        field: "lname",
                        value: item.sname,
                      });
                      dispatch({
                        type: "ADDFIELDS",
                        field: "idx",
                        value: item.idx,
                      });
                      dispatch({
                        type: "MODALACTION",
                        payload: "edit",
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(item.idx)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
export default Reducer;
