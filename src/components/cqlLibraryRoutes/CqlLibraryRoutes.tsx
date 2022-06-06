import React from "react";
import { Route, Switch } from "react-router-dom";
import CqlLibraryLanding from "../cqlLibraryLanding/CqlLibraryLanding";
import CreateEditCqlLibrary from "../createEditCqlLibrary/CreateEditCqlLibrary";

export function CqlLibraryRoutes() {
  return (
    <>
      <Switch>
        <Route exact path="/cql-libraries" component={CqlLibraryLanding} />
        <Route
          exact
          path="/cql-libraries/create"
          component={CreateEditCqlLibrary}
        />
        <Route
          exact
          path="/cql-libraries/:id/edit"
          component={CreateEditCqlLibrary}
        />
      </Switch>
    </>
  );
}

export default CqlLibraryRoutes;
