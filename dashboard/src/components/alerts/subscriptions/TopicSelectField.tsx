'use client';
import React, { useEffect, useState } from 'react';
import { MenuItem, Select } from '@mui/material';
import { TopicOption } from '@/types/types';

interface Props {
  value: number | null;
  onChange: (newValue: number) => void;
}

const fetchTopicOptions = async (): Promise<TopicOption[]> => {
  return [
    { id: 6, label: 'operational-beaching', parentId: 4 },
    { id: 9, label: 'operational-technical-battery', parentId: 4 },
    { id: 10, label: 'operational-technical-sensor', parentId: 4 },
    { id: 12, label: 'data-qc-feedback', parentId: null },
    { id: 14, label: 'info-new-deployment', parentId: null },
    { id: 17, label: 'request-ship-time', parentId: 14 },
    { id: 4, label: 'Operational Technical', parentId: null },
  ];
};

const buildTopicTree = (flatOptions: TopicOption[]): TopicOption[] => {
  const map = new Map<number, TopicOption & { children?: TopicOption[] }>();
  const roots: TopicOption[] = [];

  flatOptions.forEach((item) => map.set(item.id, { ...item }));
  map.forEach((item) => {
    if (item.parentId && map.has(item.parentId)) {
      const parent = map.get(item.parentId)!;
      if (!parent.children) parent.children = [];
      parent.children.push(map.get(item.id)!);
    } else {
      roots.push(map.get(item.id)!);
    }
  });

  return roots;
};

const TopicSelectField = ({ value, onChange }: Props) => {
  const [topics, setTopics] = useState<TopicOption[]>([]);

  useEffect(() => {
    fetchTopicOptions().then((raw) => setTopics(buildTopicTree(raw)));
  }, []);

  const renderOptions = (options: TopicOption[], level = 0): React.ReactNode[] =>
    options.flatMap((opt) => [
      <MenuItem key={opt.id} value={opt.id} sx={{ pl: 2 + level * 4 }}>
        {opt.label}
      </MenuItem>,
      ...(opt.children ? renderOptions(opt.children, level + 1) : []),
    ]);

  return (
    <Select
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      size="small"
      sx={{ width: 400, ml: 2 }}
    >
      {renderOptions(topics)}
    </Select>
  );
};

export default TopicSelectField;
