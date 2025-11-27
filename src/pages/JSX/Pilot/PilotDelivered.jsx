import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import config from "../../../config";
import BreadCrumbs from "../BreadCrumbs";

export default function PilotDelivered() {
  const [deliveredList, setDeliveredList] = useState([]);

  useEffect(() => {
    loadDeliveredOrders();
  }, []);

  const loadDeliveredOrders = async () => {
    try {
      const res = await fetch(`${config.baseURL}/orders/`);
      const orders = await res.json();

      // ONLY DELIVERED
      const delivered = orders.filter((o) => o.status === "DELIVERED");

      setDeliveredList(delivered);
    } catch (err) {
      console.error("Failed to load delivered orders:", err);
    }
  };

  return (
    <div className="pending-delivery-page">
      <div className="pilot-breadcrumb-wrapper">
        <BreadCrumbs />
      </div>

      <h2 className="page-title">Delivered Orders</h2>
      <div className="pending-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Order ID</th>
              <th>Client</th>
              <th>Drone</th>
              <th>Delivered Date</th>
            </tr>
          </thead>

          <tbody>
            {deliveredList.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                  No Delivered Orders
                </td>
              </tr>
            ) : (
              deliveredList.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.order_number}</td>
                  <td>{order.customer_name}</td>
                  <td>{order.drone_model}</td>
                  <td>
                    {order.updated_at
                      ? format(new Date(order.updated_at), "dd-MM-yyyy")
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
