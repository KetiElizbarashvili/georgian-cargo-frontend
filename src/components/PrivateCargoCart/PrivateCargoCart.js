import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import copy from "copy-to-clipboard";
import Spinner from "react-bootstrap/Spinner";
import { useRequest } from "hooks";
import { AuthContext } from "context";
import { toast } from "react-toastify";
import { Util } from "../../utils";
import { useHistory, useLocation } from "react-router";
import { flagEmoji } from "../../utils/FlagEmoji";
import moment from "moment";
import cargosRequest from "requests/cargos";
import ClientCart from "components/ClientCart/ClientCart";
import ClientNav from "components/ClientNav/ClientNav";
import ClientFooter from 'components/Footer/ClientFooter';

const PrivateCargoCart = ({ user }) => {
  const location = useLocation();


  return user && (
    <>
      <main id="content" className="bg-light mt-lg-0 mt-xl-8 mt-xxl-8" style={{ minWidth: "308px" }}>
        <div className="container ">
          <div className="row">
            <div className="col-md-3 col-sm-2 col-12 mb-4" style={{ minWidth: "50px" }}>
              <ClientNav user={user} />
            </div>
            <div className="col-md-9 col-sm-10 col-12">
              <ClientCart />
            </div>
          </div>
        </div>
        <ClientFooter />

      </main>
    </>
  );
};

export default PrivateCargoCart;
