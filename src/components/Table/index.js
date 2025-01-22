/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { useEffect, useRef, useState } from "react";
import Papa from "papaparse";
import { ethers } from "ethers";

import "./style.css";

const SenderTable = (props) => {
  let indexOfLastItem;
  let indexOfFirstItem;
  let currentItems;
  const { wallets, setWallets, isConnected } = props;
  const { currentPage, setCurrentPage } = useState(1);
  const [itemPerPage] = useState(5);
  const inputFile = useRef(null) 

  useEffect(() => {
    indexOfLastItem = currentPage * itemPerPage;
    indexOfFirstItem = indexOfLastItem - itemPerPage;
    currentItems = wallets && wallets.slice(indexOfFirstItem, indexOfLastItem);
  }, [wallets, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleUpload = () => {
    inputFile.current.click();
  };
  const uploadWallet = async (e) => {
    // setWallets(dummy);
    // const response = await fetch(process.env.PUBLIC_URL + "/wallets.csv");
    // const data = await response.text();
    // const dataArray = data.replace(/\s/g, "").split(",");
    // const resultArr = dataArray.filter((item) => item !== "");
    // setWallets(resultArr);

    const file = e.target.files[0];
    const addresses = [];
    const duplicate = [];
    const invalid = [];

    if (file) {
      Papa.parse(file, {
        header: true,
        delimiter: ",",
        skipEmptyLines: true,
        step: function (row) {
          const address = row.data.address;
          if (!ethers.isAddress(address)) {
            invalid.push(address);
            return;
          }
          if (addresses.includes(address)) {
            duplicate.push(address);
            return;
          }
          addresses.push(address);
        },
        complete: () => {
          setWallets(addresses);

          if (duplicate.length > 0) {
            alert(`Duplicate addresses: ${duplicate.join(", ")}`);
          }

          if (invalid.length > 0) {
            alert(`Invalid addresses: ${invalid.join(", ")}`);
          }
        },
      });
    }
  };

  return (
    <div>
      <Table responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Wallet Address</th>
          </tr>
        </thead>
        <tbody>
          {wallets && wallets.length > 0
            ? wallets.map((e, idx) => {
                return (
                  <tr>
                    <td>{idx + 1}</td>
                    <td>{e}</td>
                  </tr>
                );
              })
            : "No data"}
        </tbody>
      </Table>

      {/* <Pagination>
        {[
          ...Array(Math.ceil(wallets && wallets.length / itemPerPage)).key(),
        ].map(
          // eslint-disable-next-line array-callback-return
          (number) => {
            <Pagination.Item
              key={number + 1}
              active={number + 1 === currentPage}
              onClick={() => handlePageChange(number + 1)}
            >
              {number + 1}
            </Pagination.Item>;
          }
        )}
      </Pagination> */}

      <div className="tableButton">
        <input type='file'
          id='file'
          ref={inputFile}
          style={{display: 'none'}}
          onChange={uploadWallet}
        />
        <Button
          className="uploadButton"
          disabled={!isConnected}
          onClick={handleUpload}
        >
          Upload file
        </Button>
        {/* <InputGroup className="addButton">
          <Form.Control
            placeholder="New Wallet Address"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            aria-disabled={!isConnected}
          />
          <Button variant="primary" id="button-addon2" disabled={!isConnected}>
            Add
          </Button>
        </InputGroup> */}
      </div>
    </div>
  );
};

export default SenderTable;
