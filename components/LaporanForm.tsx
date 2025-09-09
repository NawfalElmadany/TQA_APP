
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import FormCard, { FormGroup, Select, Input, Button, ErrorMessage } from './FormCard';
import { getClasses, getReportDataForClass } from '../data/dataService';
import Icon from './Icon';

const LaporanForm: React.FC = () => {
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // FIX: Fetch classes asynchronously.
  useEffect(() => {
    const fetchClasses = async () => {
        setClasses(await getClasses());
    };
    fetchClasses();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('id-ID', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  // FIX: Make generatePdf async to await getReportDataForClass.
  const generatePdf = async () => {
    setIsLoading(true);
    setError('');

    if (!startDate || !endDate || !selectedClass) {
      setError('Harap lengkapi semua field: tanggal mulai, tanggal akhir, dan kelas.');
      setIsLoading(false);
      return;
    }

    const reportData = await getReportDataForClass(selectedClass, startDate, endDate);

    if (reportData.length === 0) {
      setError('Tidak ada data yang ditemukan untuk periode dan kelas yang dipilih.');
      setIsLoading(false);
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });
    
    const head = [
        [
            { content: 'No.', rowSpan: 2, styles: { halign: 'center' as const, valign: 'middle' as const } },
            { content: 'Nama Siswa', rowSpan: 2, styles: { valign: 'middle' as const } },
            { content: 'Tartili', colSpan: 2, styles: { halign: 'center' as const } },
            { content: 'Hafalan', colSpan: 2, styles: { halign: 'center' as const } },
            { content: 'Murojaah', colSpan: 2, styles: { halign: 'center' as const } }
        ],
        ['Awal Periode', 'Akhir Periode', 'Awal Periode', 'Akhir Periode', 'Awal Periode', 'Akhir Periode']
    ];
    
    const body = reportData.map((student, index) => [
      index + 1,
      student.name,
      student.tartili.awal,
      student.tartili.akhir,
      student.hafalan.awal,
      student.hafalan.akhir,
      student.murojaah.awal,
      student.murojaah.akhir
    ]);
    
    // FIX: Removed `as const` from `fillColor` to satisfy the expected mutable array type `[number, number, number]` required by jspdf-autotable styles.
    const headStyles = { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' as const };
    // FIX: Removed `as const` from `fillColor` to satisfy the expected mutable array type `[number, number, number]` required by jspdf-autotable styles.
    const alternateRowStyles = { fillColor: [245, 245, 245] };

    autoTable(doc, {
      head: head,
      body: body,
      startY: 35,
      styles: {
          fontSize: 8,
          cellPadding: 2,
      },
      headStyles: { 
          ...headStyles, 
          fontSize: 9,
          halign: 'center' as const,
          valign: 'middle' as const,
      },
      columnStyles: {
          0: { cellWidth: 10, halign: 'center' as const },
          1: { cellWidth: 40 }, // Fixed width for name
      },
      alternateRowStyles: alternateRowStyles,
      didDrawPage: function (data) {
        // Header
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text("Laporan Perkembangan Siswa TQA", data.settings.margin.left, 15);
        doc.setFontSize(11);
        doc.text(`Kelas: ${selectedClass}`, data.settings.margin.left, 24);
        doc.text(`Periode: ${formatDate(startDate)} - ${formatDate(endDate)}`, doc.internal.pageSize.width - data.settings.margin.right, 24, { align: 'right' });
        
        // Footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(`Halaman ${data.pageNumber} dari ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric'})}`, doc.internal.pageSize.width - data.settings.margin.right, doc.internal.pageSize.height - 10, { align: 'right' });
      },
    });

    doc.save(`Laporan_Kelas_${selectedClass}_${startDate}_sd_${endDate}.pdf`);
    setIsLoading(false);
  };

  return (
    <FormCard title="Buat Laporan Perkembangan PDF">
      <form onSubmit={(e) => { e.preventDefault(); generatePdf(); }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormGroup label="Tanggal Mulai">
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
          </FormGroup>

          <FormGroup label="Tanggal Akhir">
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
          </FormGroup>

          <FormGroup label="Pilih Kelas">
            <Select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} required>
              <option value="">Pilih Kelas</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </Select>
          </FormGroup>
        </div>

        {error && <div className="mt-4"><ErrorMessage>{error}</ErrorMessage></div>}

        <div className="mt-8">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center justify-center">
                <Icon name="spinner" className="w-5 h-5 mr-2 animate-spin-slow" />
                <span>Membuat Laporan...</span>
              </div>
            ) : (
              'BUAT & UNDUH LAPORAN PDF'
            )}
          </Button>
        </div>
      </form>
    </FormCard>
  );
};

export default LaporanForm;
