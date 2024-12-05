import React, { useEffect, useRef, useState } from 'react';
import { Timeline as VisTimeline } from 'vis-timeline/standalone';
import { DataSet } from 'vis-data';
import { TimelineLegend } from './TimelineLegend';
import { FilterPanel } from '../filters/FilterPanel';
import { MenuBar } from '../layout/MenuBar';
import { AddAnnotationButton } from '../annotations/AddAnnotationButton';
import { AnnotationDialog } from '../annotations/AnnotationDialog';
import { TIMELINE_OPTIONS } from '../../constants/timeline';
import { createTimelineItems } from '../../utils/timelineData';
import { exportToJson, importFromJson } from '../../utils/fileUtils';
import { TestRun, TimelineFilters, Annotation } from '../../types/timeline';
import 'vis-timeline/styles/vis-timeline-graph2d.css';

interface TimelineProps {
  data: TestRun[];
}

export const Timeline: React.FC<TimelineProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<VisTimeline | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filters, setFilters] = useState<TimelineFilters>({
    startDate: null,
    endDate: null,
    searchText: '',
    categories: []
  });

  const handleAddAnnotation = (newAnnotation: Omit<Annotation, 'id'>) => {
    const annotation: Annotation = {
      ...newAnnotation,
      id: `annotation-${Date.now()}`
    };
    setAnnotations(prev => [...prev, annotation]);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const imported = await importFromJson(file);
          if (imported.annotations) {
            setAnnotations(imported.annotations);
          }
        } catch (error) {
          console.error('Error importing file:', error);
          alert('Error importing file. Please make sure it\'s a valid JSON file.');
        }
      }
    };
    input.click();
  };

  const handleExport = () => {
    const exportData = {
      annotations,
      filters,
      exportDate: new Date().toISOString()
    };
    exportToJson(exportData);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const filteredData = data.filter(item => {
      const itemDate = new Date(parseInt(item.loadtestbegintime));
      const matchesDateRange = (!filters.startDate || itemDate >= filters.startDate) &&
                              (!filters.endDate || itemDate <= filters.endDate);
      const matchesSearch = item.name.toLowerCase().includes(filters.searchText.toLowerCase());
      const matchesCategories = filters.categories.length === 0 || 
                               annotations.some(a => 
                                 filters.categories.includes(a.category) && 
                                 a.time >= itemDate && 
                                 a.time <= new Date(parseInt(item.loadtestendtime))
                               );
      return matchesDateRange && matchesSearch && matchesCategories;
    });

    const items = new DataSet([
      ...createTimelineItems(filteredData),
      ...annotations.map(a => ({
        id: a.id,
        content: a.content,
        start: a.time,
        type: 'point',
        className: `annotation-${a.category.toLowerCase()}`,
        title: `${a.category}: ${a.content}`
      }))
    ]);

    timelineRef.current = new VisTimeline(containerRef.current, items, TIMELINE_OPTIONS);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.destroy();
      }
    };
  }, [data, filters, annotations]);

  return (
    <div className="min-h-screen bg-gray-50">
      <MenuBar onImport={handleImport} onExport={handleExport} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Test Runs Timeline</h2>
              <AddAnnotationButton onClick={() => setIsDialogOpen(true)} />
            </div>
            <TimelineLegend />
            <FilterPanel filters={filters} onFilterChange={setFilters} />
          </div>
          <div ref={containerRef} className="border rounded-lg shadow-sm min-h-[600px]"></div>
        </div>
      </div>
      <AnnotationDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleAddAnnotation}
      />
    </div>
  );
};