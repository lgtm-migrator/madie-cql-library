import React, { useState, useRef } from "react";
import { CqlLibrary, Model } from "@madie/madie-models";
import { CqlLibrarySchemaValidator } from "../../validators/CqlLibrarySchemaValidator";
import useCqlLibraryServiceApi from "../../api/useCqlLibraryServiceApi";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {
  MadieDialog,
  Select,
  TextField,
  Toast,
} from "@madie/madie-design-system/dist/react";
import { Box } from "@mui/system";
import { FormHelperText, MenuItem } from "@mui/material";
import { useFormik } from "formik";

interface TestProps {
  open: boolean;
  onClose(): any;
  onSuccess?(): any;
}

const CreateNewLibraryDialog: React.FC<TestProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  interface Toast {
    toastOpen: boolean;
    toastType: string;
    toastMessage: string;
  }
  const [toast, setToast] = useState<Toast>({
    toastOpen: false,
    toastType: null,
    toastMessage: "",
  });
  const { toastOpen, toastType, toastMessage } = toast;
  const cqlLibraryServiceApi = useRef(useCqlLibraryServiceApi()).current;
  async function createCqlLibrary(cqlLibrary: CqlLibrary) {
    cqlLibraryServiceApi
      .createCqlLibrary(cqlLibrary)
      .then(() => {
        setToast({
          toastOpen: true,
          toastType: "success",
          toastMessage: "Cql Library successfully created",
        });
        onClose();
        if (onSuccess) {
          onSuccess();
        }
        resetForm();
      })
      .catch((error) => {
        if (error?.response) {
          let msg: string = error.response.data.message;
          if (!!error.response.data.validationErrors) {
            for (const erroredField in error.response.data.validationErrors) {
              msg = msg.concat(
                ` ${erroredField} : ${error.response.data.validationErrors[erroredField]}`
              );
            }
          }
          setToast({
            toastOpen: true,
            toastType: "danger",
            toastMessage: msg,
          });
        } else {
          setToast({
            toastOpen: true,
            toastType: "danger",
            toastMessage: "An error occurred while creating the CQL Library",
          });
        }
      });
  }
  async function handleSubmit(cqlLibrary: CqlLibrary) {
    createCqlLibrary(cqlLibrary);
  }
  const formik = useFormik({
    initialValues: {
      cqlLibraryName: "",
      model: "",
      cql: "",
      draft: true,
    } as CqlLibrary,
    validationSchema: CqlLibrarySchemaValidator,
    onSubmit: handleSubmit,
  });
  const { resetForm } = formik;
  function formikErrorHandler(name: string, isError: boolean) {
    if (formik.touched[name] && formik.errors[name]) {
      return (
        <FormHelperText
          data-testid={`${name}-helper-text`}
          children={formik.errors[name]}
          error={isError}
        />
      );
    }
  }
  // style utilities
  const row = {
    display: "flex",
    flexDirection: "row",
  };
  const spaced = {
    marginTop: "23px",
  };
  const formRow = Object.assign({}, row, spaced);
  const gap = {
    columnGap: "24px",
    "& > * ": {
      flex: 1,
    },
  };
  const formRowGapped = Object.assign({}, formRow, gap);

  return (
    <div>
      <MadieDialog
        form
        title="Create Library"
        dialogProps={{
          open,
          onClose,
          onSubmit: formik.handleSubmit,
          maxWidth: "sm",
          showRequiredFieldMessage: true,
        }}
        cancelButtonProps={{
          id: "cancelBtn",
          "data-testid": "cql-library-cancel-button",
          variant: "secondary",
          onClick: () => {
            onClose();
            resetForm();
          },
          cancelText: "Cancel",
        }}
        continueButtonProps={{
          type: "submit",
          "data-testid": "create-new-library-save-button",
          disabled: !(formik.isValid && formik.dirty),
          continueText: "Continue",
          continueIcon: (
            <ChevronRightIcon
              sx={{
                fontSize: 22,
                margin: "-9px -14px -7px 4px",
              }}
            />
          ),
        }}
      >
        <>
          <Box sx={formRow}>
            <TextField
              placeholder="Enter a Cql Library Name"
              required
              label="Library Name"
              id="cqlLibraryName"
              data-testid="cql-library-name-text-field"
              inputProps={{
                "data-testid": "cql-library-name-text-field-input",
              }}
              helperText={formikErrorHandler("cqlLibraryName", true)}
              size="small"
              error={
                formik.touched.cqlLibraryName &&
                Boolean(formik.errors.cqlLibraryName)
              }
              {...formik.getFieldProps("cqlLibraryName")}
            />
          </Box>
          <Box sx={formRowGapped}>
            <Select
              placeHolder={{ name: "Model", value: "" }}
              required
              label="Model"
              id="model-select"
              data-testid="cql-library-model-select"
              inputProps={{ "data-testid": "cql-library-model-select-input" }}
              name="model"
              {...formik.getFieldProps("model")}
              error={formik.touched.model && Boolean(formik.errors.model)}
              helperText={formik.touched.model && formik.errors.model}
              size="small"
              options={Object.keys(Model).map((modelKey) => {
                return (
                  <MenuItem
                    key={modelKey}
                    value={Model[modelKey]}
                    data-testid={`cql-library-model-option-${Model[modelKey]}`}
                  >
                    {Model[modelKey]}
                  </MenuItem>
                );
              })}
            />
            <Box />
          </Box>
        </>
      </MadieDialog>
      <Toast
        toastKey="cql-library-information-toast"
        toastType={toastType}
        testId={
          toastType === "danger"
            ? "create-cql-library-error-text"
            : "create-cql-library-success-text"
        }
        open={toastOpen}
        message={toastMessage}
        onClose={() => {
          setToast({
            toastOpen: false,
            toastType: null,
            toastMessage: "",
          });
        }}
        autoHideDuration={6000}
      />
    </div>
  );
};

export default CreateNewLibraryDialog;