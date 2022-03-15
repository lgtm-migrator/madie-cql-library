import React, { useRef, useState } from "react";
import tw from "twin.macro";
import "styled-components/macro";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";
import CqlLibrary from "../../models/CqlLibrary";
import { CqlLibrarySchemaValidator } from "../../models/CqlLibrarySchemaValidator";
import { Button, HelperText, Label, TextInput } from "@madie/madie-components";
import useCqlLibraryServiceApi from "../../api/useCqlLibraryServiceApi";

const ErrorAlert = tw.div`bg-red-200 rounded-lg py-3 px-3 text-red-900 mb-3`;
const FormRow = tw.div`mt-3`;

const CreateNewCqlLibrary = () => {
  const history = useHistory();
  const [serverError, setServerError] = useState(undefined);
  const cqlLibraryServiceApi = useRef(useCqlLibraryServiceApi()).current;

  const formik = useFormik({
    initialValues: {
      cqlLibraryName: "",
    } as CqlLibrary,
    validationSchema: CqlLibrarySchemaValidator,
    onSubmit: async (cqlLibrary: CqlLibrary) => {
      await createCqlLibrary(cqlLibrary);
    },
  });

  async function createCqlLibrary(cqlLibrary: CqlLibrary) {
    cqlLibraryServiceApi
      .createCqlLibrary(cqlLibrary)
      .then(() => {
        history.push("/cql-libraries");
      })
      .catch((error) => {
        let msg: string = error.response.data.message;
        if (!!error.response.data.validationErrors) {
          for (const erroredField in error.response.data.validationErrors) {
            msg = msg.concat(
              ` ${erroredField} : ${error.response.data.validationErrors[erroredField]}`
            );
          }
        }
        setServerError(msg);
      });
  }

  function formikErrorHandler(name: string, isError: boolean) {
    if (formik.touched[name] && formik.errors[name]) {
      return (
        <HelperText
          data-testid={`${name}-helper-text`}
          text={formik.errors[name]}
          isError={isError}
        />
      );
    }
  }

  return (
    <div tw="m-5">
      {serverError && (
        <ErrorAlert data-testid="cql-library-server-error-alerts" role="alert">
          {serverError}
        </ErrorAlert>
      )}
      <form
        data-testid="create-new-cql-library-form"
        onSubmit={formik.handleSubmit}
      >
        <FormRow>
          <TextInput
            type="text"
            id="cqlLibraryName"
            {...formik.getFieldProps("cqlLibraryName")}
            placeholder="Enter a Cql Library Name"
            data-testid="cql-library-name-text-field"
          >
            <Label htmlFor="cqlLibraryName" text="Cql Library Name" />
            {formikErrorHandler("cqlLibraryName", true)}
          </TextInput>
        </FormRow>
        <FormRow>
          <Button
            buttonTitle="Create Cql Library"
            type="submit"
            tw="mr-3"
            data-testid="create-new-cql-library-save-button"
            disabled={!(formik.isValid && formik.dirty)}
          />
          <Button
            buttonTitle="Cancel"
            type="button"
            variant="white"
            onClick={() => {
              history.push("/cql-libraries");
            }}
            data-testid="create-new-cql-library-cancel-button"
          />
        </FormRow>
      </form>
    </div>
  );
};

export default CreateNewCqlLibrary;