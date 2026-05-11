 export interface CardData {
    title: string;
    icon: string;
    data: string | number;
    comparison: string;
    showAvatarGroup?: boolean;
}

export const cardInfo= [
    { title: 'Total Workforce', icon: 'uit:bag', data: 150, comparison: '10% vs last month' },
    { title: 'Today Attendance', icon: 'hugeicons:office-chair', data: 120, comparison: '5% vs yesterday' },
    { title: 'Late Arrivals', icon: 'bi:alarm', data: 10, comparison: '2% vs yesterday' },
    { title: 'Absent Workforce', icon: 'material-symbols-light:error-outline', data: 20, comparison: '3% vs yesterday' },
    { title: 'On Leave', icon: 'hugeicons:beach', data: 5, comparison: '1% vs yesterday' },
    { title: 'Out of Radius', icon: 'lucide:radius', data: 3, comparison: '1% vs yesterday', showAvatarGroup: true },
];