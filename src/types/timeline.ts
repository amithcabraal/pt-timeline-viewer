export interface TestRun {
  run_id: number;
  name: string;
  ui_status: 'PASSED' | 'FAILED' | 'STOPPED' | 'SYSTEM_ERROR';
  duration: number;
  test_run_user: string;
  api_vusers_num: number;
  loadtestbegintime: string;
  loadtestendtime: string;
}

export interface TimelineItem {
  id: number;
  content: string;
  start: Date;
  end: Date;
  className: string;
  title: string;
}

export interface Annotation {
  id: string;
  time: Date;
  content: string;
  category: string;
  color: string;
}

export interface TimelineFilters {
  startDate: Date | null;
  endDate: Date | null;
  searchText: string;
  categories: string[];
}