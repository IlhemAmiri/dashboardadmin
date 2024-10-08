"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import SideNavbar from "../../components/SideNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const PaymentRecordPage = ({ params }) => {
  const [reservation, setReservation] = useState(null);
  const [socialMedia, setSocialMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [discount, setDiscount] = useState(0); // New state for discount
  const [applyVAT, setApplyVAT] = useState(false); // New state for VAT
  const router = useRouter();
  const printRef = useRef();
  const { reservationId } = params;

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/reservations/${reservationId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setReservation(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch reservation", error);
        router.push("/404");
      }
    };

    const fetchSocialMedia = async () => {
      try {
        const response = await axios.get("http://localhost:3001/socialmedia", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setSocialMedia(response.data);
      } catch (error) {
        console.error("Failed to fetch social media", error);
      }
    };

    fetchReservation();
    fetchSocialMedia();
  }, [reservationId, router]);

  const calculateNbJours = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateDiscountedPrice = () => {
    const basePrice = reservation.tarifTotale;
    const discountedPrice = basePrice * ((100 - discount) / 100);
    return applyVAT ? discountedPrice * 1.19 : discountedPrice;
  };

  const handleDownload = () => {
    const input = printRef.current;
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("payment_record.pdf");
      })
      .catch((err) => console.error("Error generating PDF", err));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!reservation || !socialMedia) {
    return <div>Data not found</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SideNavbar />
      <div className="flex-1 ml-0 md:ml-60 py-8 px-4 transition-all duration-300">
        <div className="mx-auto p-8" ref={printRef}>
          <h1 className="text-3xl font-bold mb-8 text-center">
            Payment Record
          </h1>

          <div className="mb-8 flex justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Company Information
              </h2>
              <p>
                <strong>Name:</strong> Rentay
              </p>
              <p>
                <strong>Email:</strong> {socialMedia.email}
              </p>
              <p>
                <strong>Phone:</strong> {socialMedia.numTel}
              </p>
              <p>
                <strong>Location:</strong> {socialMedia.localisation}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Client Information
              </h2>
              <p>
                <strong>Name:</strong> {reservation.idClient.nom}{" "}
                {reservation.idClient.prenom}
              </p>
              <p>
                <strong>Email:</strong> {reservation.idClient.email}
              </p>
              <p>
                <strong>Address:</strong> {reservation.idClient.adresse}
              </p>
              <p>
                <strong>Phone:</strong> {reservation.idClient.numTel}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-center">
              Reservation Information
            </h2>
            <table className="min-w-full bg-white mb-8 border border-gray-200">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="py-2 px-4 font-semibold text-lg text-left border-r border-gray-200">
                    Car Details
                  </th>
                  <th className="py-2 px-4 font-semibold text-lg text-left border-r border-gray-200">
                    Start Date
                  </th>
                  <th className="py-2 px-4 font-semibold text-lg text-left border-r border-gray-200">
                    End Date
                  </th>
                  <th className="py-2 px-4 font-semibold text-lg text-left border-r border-gray-200">
                    Payment Status
                  </th>
                  <th className="py-2 px-4 font-semibold text-lg text-left border-r border-gray-200">
                    Pickup Location
                  </th>
                  <th className="py-2 px-4 font-semibold text-lg text-left border-r border-gray-200">
                    Destination
                  </th>
                  <th className="py-2 px-4 font-semibold text-lg text-left border-r border-gray-200">
                    Price per Day
                  </th>
                  <th className="py-2 px-4 font-semibold text-lg text-left border-r border-gray-200">
                    Number of Days
                  </th>
                  <th className="py-2 px-4 font-semibold text-lg text-left">
                    Total Price
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 border-r border-gray-200">
                    <p>
                      <strong>ID Vehicle:</strong> {reservation.idVoiture._id}
                    </p>
                    <p>
                      <strong>Vehicle Type:</strong>{" "}
                      {reservation.idVoiture.vehicleType}
                    </p>
                    <p>
                      <strong>Make and Model:</strong>{" "}
                      {reservation.idVoiture.marque}{" "}
                      {reservation.idVoiture.modele}
                    </p>
                    <p>
                      <strong>Year:</strong>{" "}
                      {reservation.idVoiture.anneeFabrication}
                    </p>
                  </td>
                  <td className="py-2 px-4 border-r border-gray-200">
                    {new Date(reservation.dateDebut).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-200">
                    {new Date(reservation.dateFin).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-200">
                    {reservation.statusPaiement}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-200">
                    {reservation.lieuRamassage}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-200">
                    {reservation.destination}
                  </td>
                  <td className="py-2 px-4 border-r border-gray-200">
                    {reservation.idVoiture.prixParJ} $
                  </td>
                  <td className="py-2 px-4 border-r border-gray-200">
                    {calculateNbJours(
                      reservation.dateDebut,
                      reservation.dateFin
                    )}{" "}
                    days
                  </td>
                  <td className="py-4 px-4 font-semibold text-xl">
                    {reservation.tarifTotale} $
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-gray-50">
            <h2 className="text-2xl font-semibold mb-4">Payment Adjustments</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {/* Display discount as text for PDF */}
                <p className="mt-2 text-lg font-medium">
                  Applied Discount: {discount}%
                </p>
              </div>
              <div>
                {/* Display VAT choice as text for PDF */}
                <p className="mt-2 text-lg font-medium">
                  VAT Applied: {applyVAT ? "Yes" : "No"}
                </p>
              </div>
            </div>
            <div className="text-right text-xl font-semibold mt-8">
              <p>
                Price after Discount and VAT:{" "}
                <span className="text-blue-600">
                  {calculateDiscountedPrice().toFixed(2)} $
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="m-8 p-8 border border-gray-300 rounded-lg bg-gray-50">
          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">
              Apply VAT (19%)
            </label>
            <select
              value={applyVAT}
              onChange={(e) => setApplyVAT(e.target.value === "true")}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">
              Discount (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => {
                const value = Math.max(
                  0,
                  Math.min(100, Number(e.target.value))
                );
                setDiscount(value);
              }}
              className="border border-gray-300 rounded px-4 py-2 w-full"
              placeholder="Enter discount percentage"
            />
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleDownload}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 flex items-center justify-center"
          >
            <FontAwesomeIcon icon={faDownload} className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentRecordPage;
