"use client";

import type React from 'react';
import { useState, useMemo } from 'react';
import Image from 'next/image';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FilePenLine, Trash2, MoreVertical, ArrowUpDown, Users, Cake, MapPin, Building, Search } from 'lucide-react';
import type { Patient } from '@/lib/types';
import { cn } from '@/lib/utils'; // Added import for cn

const ITEMS_PER_PAGE = 10;

interface PatientTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (patientId: number) => void;
}

type SortKey = keyof Patient | null;

const PatientTable: React.FC<PatientTableProps> = ({ patients, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female' | 'other'>('all');

  const handleSort = (key: keyof Patient) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };
  
  const filteredPatients = useMemo(() => {
    let filtered = patients.filter((patient) => {
      const term = searchTerm.toLowerCase();
      return (
        patient.firstName.toLowerCase().includes(term) ||
        patient.lastName.toLowerCase().includes(term) ||
        patient.email.toLowerCase().includes(term) ||
        patient.admissionDepartment.toLowerCase().includes(term) ||
        patient.address.city.toLowerCase().includes(term)
      );
    });

    if (genderFilter !== 'all') {
      filtered = filtered.filter(patient => patient.gender === genderFilter);
    }
    
    return filtered;
  }, [patients, searchTerm, genderFilter]);


  const sortedPatients = useMemo(() => {
    if (!sortKey) return filteredPatients;
    return [...filteredPatients].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let valA: any = a[sortKey];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let valB: any = b[sortKey];

      if (sortKey === 'address') { // Handle nested 'city' for address
        valA = a.address.city;
        valB = b.address.city;
      }
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredPatients, sortKey, sortOrder]);

  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedPatients.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedPatients, currentPage]);

  const totalPages = Math.ceil(sortedPatients.length / ITEMS_PER_PAGE);

  const renderSortIcon = (key: keyof Patient) => {
    if (sortKey === key) {
      return sortOrder === 'asc' ? ' ▲' : ' ▼';
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-50" />;
  };

  const SortableTableHead: React.FC<{ sortFieldKey: keyof Patient, children: React.ReactNode, className?: string}> = ({ sortFieldKey, children, className }) => (
    <TableHead className={cn("cursor-pointer hover:bg-muted/50", className)} onClick={() => handleSort(sortFieldKey)}>
      <div className="flex items-center">
        {children}
        {renderSortIcon(sortFieldKey)}
      </div>
    </TableHead>
  );


  return (
    <div className="bg-card p-6 shadow-lg rounded-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-4">
        <div className="relative w-full sm:w-1/2 lg:w-1/3">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
           <Input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-10 w-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Filter by Gender: {genderFilter.charAt(0).toUpperCase() + genderFilter.slice(1)}
              <Users className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {['all', 'male', 'female', 'other'].map((genderOpt) => (
              <DropdownMenuItem key={genderOpt} onClick={() => {
                setGenderFilter(genderOpt as 'all' | 'male' | 'female' | 'other');
                setCurrentPage(1);
              }}>
                {genderOpt.charAt(0).toUpperCase() + genderOpt.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <SortableTableHead sortFieldKey="firstName">Name</SortableTableHead>
              <SortableTableHead sortFieldKey="age" className="hidden md:table-cell">
                <Cake className="inline mr-1 h-4 w-4" /> Age
              </SortableTableHead>
              <SortableTableHead sortFieldKey="gender" className="hidden md:table-cell">
                 <Users className="inline mr-1 h-4 w-4" /> Gender
              </SortableTableHead>
              <SortableTableHead sortFieldKey="address" className="hidden lg:table-cell">
                <MapPin className="inline mr-1 h-4 w-4" /> City
              </SortableTableHead>
              <SortableTableHead sortFieldKey="admissionDepartment" className="hidden lg:table-cell">
                <Building className="inline mr-1 h-4 w-4" /> Department
              </SortableTableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <Image
                    src={patient.image || 'https://placehold.co/40x40.png'}
                    alt={`${patient.firstName} ${patient.lastName}`}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                    data-ai-hint="person avatar"
                  />
                </TableCell>
                <TableCell className="font-medium">{`${patient.firstName} ${patient.lastName}`}</TableCell>
                <TableCell className="hidden md:table-cell">{patient.age}</TableCell>
                <TableCell className="hidden md:table-cell">{patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}</TableCell>
                <TableCell className="hidden lg:table-cell">{patient.address.city}</TableCell>
                <TableCell className="hidden lg:table-cell">{patient.admissionDepartment}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(patient)}>
                        <FilePenLine className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(patient.id)} className="text-destructive hover:!bg-destructive/10 focus:!bg-destructive/10 focus:!text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {paginatedPatients.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No patients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default PatientTable;
