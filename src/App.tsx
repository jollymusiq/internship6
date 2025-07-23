import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

export default function App() {
  const [selectedArtworks, setSelectedArtworks] = useState<Artwork[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const rowsPerPage = 12;

  const fetchData = async (page: number) => {
    const fields = [
      "id",
      "title",
      "place_of_origin",
      "artist_display",
      "inscriptions",
      "date_start",
      "date_end",
    ].join(",");

    const url = `https://api.artic.edu/api/v1/artworks?page=${page}&limit=${rowsPerPage}&fields=${fields}`;

    try {
      const res = await fetch(url);
      const json = await res.json();

      setArtworks(json.data);
      setTotalRecords(json.pagination?.total ?? 0);
      setCurrentPage(json.pagination?.current_page ?? page);
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  const onPageChange = (e: PaginatorPageChangeEvent) => {
    const nextPage = Math.floor(e.first / rowsPerPage) + 1;
    fetchData(nextPage);
  };

  
  return (
    <>
    <div className="card" 
      style={{
      marginTop: 'none',  
      backgroundColor:'white',
      maxHeight:'900dvh',
      maxWidth:'1000dvw',
    }} >
      <h3 style={{
          borderRadius: '10px',
          background:'#e7e97f',
          fontFamily: 'fantasy',
          marginLeft: '25dvw',
          placeContent:'center',
          placeItems:'center',
          maxHeight: '70%',
          maxWidth: '50%',
          display: 'flex',
          alignSelf:'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: '#f8f8f8'
        }}>Artworks from the Art Institute of Chicago</h3>
      <DataTable
          style={{
          borderRadius: '10px',  
          background:'#e7e97f',  
          fontFamily:'cursive',
          marginLeft: '25dvw',
          placeContent:'center',
          placeItems:'center',
          maxHeight: '50%',
          maxWidth: '53.5%',
          display: 'flex',
          alignSelf:'center',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: '#f8f8f8'
        }}
          value={artworks}
          selection={selectedArtworks}
          onSelectionChange={(e) => setSelectedArtworks(e.value)}
          dataKey="id"
          selectionMode="multiple" // 👈 Add this line
          showGridlines
          stripedRows
          responsiveLayout="scroll"
        >
        <Column selectionMode="multiple"/>
        <Column field="id" header="ID" />
        <Column field="title" header="Title" />
        <Column field="artist_display" header="Artist" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>

      <Paginator
        className="custom-paginator"
        first={(currentPage - 1) * rowsPerPage}
        rows={rowsPerPage}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
      />
    </div>
    </>
  );
}



