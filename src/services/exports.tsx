import React from "react";
import ReactPDF, { Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";

// The 'theme' object is your Tailwind theme config
const tw = createTw({

});

export function MyPdf() {
  return (

    <Document>
      <Page size="A4" style={tw("p-12")}>
        <View style={tw("p-20 bg-gray-100")}>
          <Text style={tw("text-green text-3xl")}>Section #1</Text>
        </View>
        <View style={tw("mt-12 px-8 rotate-2")}>
          <Text style={tw("text-amber-600 text-2xl")}>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
}


export function downloadPDF() {

  ReactPDF.render(<MyPdf />, `${__dirname}/example.pdf`);
}

export function downloadPDFButton() {
  return (
    <div className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block">
      <PDFDownloadLink document={<MyPdf />} fileName="somename.pdf">
        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
      </PDFDownloadLink>
    </div>
  )
}

export async function getPDFAsData() {
  const blob = await pdf(<MyPdf />).toBlob()
  return blob
}