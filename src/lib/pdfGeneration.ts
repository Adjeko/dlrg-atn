import { jsPDF } from "jspdf";
import { autoTable } from 'jspdf-autotable'
import type { Schedule } from "./types/Schedule";
import { logo } from "./logo";
import type { User } from "./types/User";

export function generateStyledPDF(user : User, start : Date, end : Date,schedules: Schedule[]) {
    const doc = new jsPDF();

     // Überschrift hinzufügen
     doc.setFontSize(20);
     doc.text("Ausbildungs- und Tätigkeitsnachweis", 50, 16);
     doc.setFontSize(12);
     doc.text(`von ${start.toLocaleString('de-DE', { year: 'numeric', month: 'long'})} bis ${end.toLocaleString('de-DE', { year: 'numeric', month: 'long'})}`, 50, 21);

    // Briefkopf
    doc.addImage(logo, "PNG", 10, 10, 30, 30); // Logo hinzufügen
    doc.setFontSize(16);
    doc.text(user.name, 50, 35);
    doc.setFontSize(12);
    doc.text(user.email, 50, 40);

    // Linie unter dem Briefkopf
    doc.line(10, 50, 200, 50);

    // Tabelle mit Kursdaten
    const tableColumns = ["Kursname", "Datum", "Punkte"];
    const tableRows = schedules.map((schedule) => {
        const startDate = new Date(schedule.startDateTime);
        const endDate = new Date(schedule.endDateTime);
        const isSameDay = startDate.toDateString() === endDate.toDateString();

        if(isSameDay) {
            //ein Tages Termin
            const startDateString = `${startDate.getDate().toString().padStart(2, "0")}.${(startDate.getMonth() + 1).toString().padStart(2, "0")}.${startDate.getFullYear()}`;
            return [schedule.course.title, startDateString, schedule.points];
        }
        else {
            //Termin mit mehreren Tagen
            const startDateString = `${startDate.getDate().toString().padStart(2, "0")}.${(startDate.getMonth() + 1).toString().padStart(2, "0")}.${startDate.getFullYear()}`;
            const endDateString = `${endDate.getDate().toString().padStart(2, "0")}.${(endDate.getMonth() + 1).toString().padStart(2, "0")}.${endDate.getFullYear()}`;
            return [schedule.course.title, `${startDateString} - ${endDateString}`, schedule.points];
        }        
    });

    autoTable(doc, {
        startY: 60, // Beginn der Tabelle unterhalb des Briefkopfs
        head: [tableColumns],
        body: tableRows,
        theme: "striped", // Stil der Tabelle
        styles: {
            fontSize: 10,
            cellPadding: 5,
        },
        headStyles: {
            fillColor: [220, 6, 18],
            textColor: [247, 230, 0],
            halign: "center",
        },
        bodyStyles: {
            halign: "center",
        },
    });

    // PDF speichern
    doc.save("Bericht.pdf");
}