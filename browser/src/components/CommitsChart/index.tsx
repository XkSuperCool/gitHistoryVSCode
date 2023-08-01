import * as React from 'react';
import * as dayjs from 'dayjs';

const data = {
    '2023-03-07': 1,
    '2023-02-21': 5,
    '2023-02-11': 1,
    '2023-02-10': 1,
    '2023-02-06': 7,
    '2023-02-05': 4,
    '2023-02-04': 1,
    '2023-02-03': 22,
    '2023-02-02': 10,
    '2023-02-01': 11,
    '2023-01-30': 2,
    '2023-01-28': 2,
    '2023-01-27': 1,
    '2023-01-26': 19,
    '2023-01-21': 1,
    '2023-01-20': 1,
    '2023-01-16': 1,
    '2023-01-12': 2,
    '2023-01-09': 6,
    '2023-01-01': 1,
    '2022-12-23': 1,
    '2022-11-30': 2,
    '2022-11-25': 1,
    '2022-11-14': 25,
    '2022-11-13': 11,
    '2022-11-11': 9,
    '2022-11-10': 18,
    '2022-11-09': 10,
    '2022-11-08': 24,
    '2022-11-07': 13,
    '2022-11-01': 1,
    '2022-10-28': 2,
    '2022-10-27': 1,
    '2022-10-26': 15,
    '2022-10-22': 2,
    '2022-10-21': 1,
    '2022-10-20': 2,
    '2022-10-14': 5,
    '2022-10-11': 1,
    '2022-10-06': 1,
    '2022-10-05': 1,
    '2022-10-04': 1,
    '2022-10-03': 5,
    '2022-09-28': 8,
    '2022-09-27': 12,
    '2022-09-26': 1,
    '2022-09-24': 1,
    '2022-09-21': 1,
    '2022-09-13': 1,
    '2022-09-08': 3,
    '2022-09-07': 1,
    '2022-09-01': 2,
    '2022-08-31': 3,
    '2022-08-30': 5,
    '2022-08-28': 2,
    '2022-08-18': 1,
    '2022-08-17': 1,
    '2022-08-15': 1,
};

export interface TimeLine {
    date: string;
    count: number;
    x?: number;
    y?: number;
}

interface CommitsChartsState {
    svgElements?: SVGElement[];
    timelines: Required<TimeLine>[];
}

function binarySearch(array: Required<TimeLine>[], x: number) {
    let left = 0;
    let right = array.length - 1;
    let result: Required<TimeLine>;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (array[mid].x < x) {
            result = array[mid];
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return result;
}

export default class CommitsCharts extends React.Component<{}, CommitsChartsState> {
    state: CommitsChartsState = {
        timelines: [],
    };

    private getLastYearTimeLines() {
        let maxCount = 0;
        const timelines: TimeLine[] = [];
        const dayLastYear = dayjs().subtract(1, 'year');
        for (let i = 0; i < 365; i++) {
            const date = dayLastYear.add(i, 'day').format('YYYY-MM-DD');
            const count = data[date] ? data[date] : 0;
            if (count > maxCount) {
                maxCount = count;
            }
            timelines.push({
                date,
                count,
            });
        }
        return {
            timelines,
            maxCount,
        };
    }

    private onMouseMove = (e: MouseEvent) => {
        const { timelines } = this.state;
        const timeline = binarySearch(timelines, e.x);
        this.cleanSvgElements();
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const x = timeline.x.toString();
        const y = timeline.y.toString();
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', '3');
        circle.setAttribute('fill', 'var(--vscode-gitDecoration-addedResourceForeground)');

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line.setAttribute('stroke', 'rgba(219, 215, 202, 0.79)');
        line.setAttribute('fill', 'none');
        line.setAttribute('d', `M ${x} 0 ${x} 35`);

        this.svg.appendChild(line);
        this.svg.appendChild(circle);
        this.setState({ svgElements: [circle, line] });
    };

    private cleanSvgElements = () => {
        const { svgElements } = this.state;
        if (svgElements) {
            svgElements.map(item => {
                this.svg.removeChild(item);
            });
            this.setState({ svgElements: [] });
        }
    };

    private drawTimeLines = () => {
        this.svg.childNodes.forEach(node => {
            this.svg.removeChild(node);
        });
        const width = this.svg.getBoundingClientRect().width;
        const { timelines, maxCount } = this.getLastYearTimeLines();
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        line.setAttribute('stroke', 'var(--vscode-gitDecoration-addedResourceForeground)');
        line.setAttribute('fill', 'none');
        let pathData = 'M 10 35';
        const pointSpacing = (width - 10) / 365;
        for (let i = 0; i < timelines.length; i++) {
            const time = timelines[i];
            const x = i * pointSpacing + 5;
            const y = 35 - (time.count / maxCount) * 30;
            pathData += ` L ${x} ${y}`;
            time.x = x;
            time.y = y;
        }
        line.setAttribute('d', pathData);
        this.svg.appendChild(line);
        this.setState({ timelines: timelines as Required<TimeLine>[] });
    };

    private onMouseLeave = () => {
        this.cleanSvgElements();
    };

    public componentWillUnmount() {
        this.svg.removeEventListener('mousemove', this.onMouseMove);
        this.svg.removeEventListener('mouseleave', this.onMouseLeave);
        window.removeEventListener('resize', this.drawTimeLines);
    }

    public componentDidMount() {
        this.svg.addEventListener('mousemove', this.onMouseMove);
        this.svg.addEventListener('mouseleave', this.onMouseLeave);
        window.addEventListener('resize', this.drawTimeLines);
        this.drawTimeLines();
    }

    private svg: SVGSVGElement;
    render() {
        return <svg className="commits-chart" ref={ref => (this.svg = ref)} xmlns="http://www.w3.org/2000/svg"></svg>;
    }
}
