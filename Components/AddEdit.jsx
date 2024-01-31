import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TextField } from "@mui/material";
import { useMutation } from "react-query";
import axios from "axios";
import Swal from "sweetalert2";

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const AddEdit = (props) => {
  const { data: isAdd, mutate: addData } = useMutation("post", (values) =>
    axios
      .post(`http://localhost:3002/api/addapi`, values)
      .then((res) => res.data.data)
  );

  const { data: isUpdate, mutate: updateData } = useMutation(
    "update",
    (values) =>
      axios
        .post(`http://localhost:3002/api/updateapi`, values)
        .then((res) => res.data.data)
  );

  const handleAddEdit = async () => {
    const valid = await props.isValid();
    if (valid) {
      if (props.values.modalAction === "add") {
        addData({ values: props.values.addNewData });
      } else if (props.values.modalAction === "edit") {
        updateData({ values: props.values.addNewData });
      }
    }
  };

  useEffect(() => {
    console.log(isAdd);
    if (isAdd || isUpdate) {
      if (isAdd === "success") {
        props.refetch();
        props.dispatch({ type: "ADDEDITMODAL", payload: false });
        Toast.fire({
          icon: "success",
          title: "Data added successfully",
        });
      }
      if (isUpdate === "success") {
        props.refetch();
        props.dispatch({ type: "ADDEDITMODAL", payload: false });
        Toast.fire({
          icon: "success",
          title: "Data updated successfully",
        });
      }
    }
  }, [isAdd, isUpdate]);

  const handleClose = () => {
    props.dispatch({ type: "ADDEDITMODAL", payload: false });
    props.dispatch({ type: "ERROR", payload: { field: "" } });
  };

  const handleChange = (field, value) => {
    console.log("field", field);
    props.dispatch({ type: "ADDFIELDS", field, value });
    props.dispatch({ type: "ERROR", payload: { field: "" } });
  };

  return (
    <div>
      <React.Fragment>
        <Dialog
          open={props.values.isOpenAddEditModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle style={{ margin: "0px 100px 0px 100px" }}>
            ADD NEW RECORD
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <div className="mb-4">
                <TextField
                  variant="standard"
                  label="First Name"
                  value={props.values.addNewData.fname}
                  name="fname"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  style={{ width: "100%" }}
                  error={Boolean(props.values.errors.fname)}
                  helperText={props.values.errors.fname}
                />
              </div>
              <div>
                <TextField
                  variant="standard"
                  label="Last Name"
                  name="lname"
                  value={props.values.addNewData.lname}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  style={{ width: "100%" }}
                  error={Boolean(props.values.errors.lname)}
                  helperText={props.values.errors.lname}
                />
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions className="mb-3">
            <Button onClick={handleAddEdit} variant="outlined">
              Save
            </Button>
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </div>
  );
};
export default AddEdit;
