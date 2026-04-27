import Chart from "react-apexcharts";

const WeightChart = ({ data }) => {
    let routes = ([...new Set(data.map(x => x.route))]);

    let total = 0;

    let srs = [];

    for (let i = 0; i < routes.length; i++) {
        srs.push(data.filter(f => f.route === routes[i]).reduce((n, { cargo_weight }) => n + parseFloat(cargo_weight), 0).toFixed(2));
    }

    let srsOriginals = [...srs];

    for (let i = 0; i < srsOriginals.length; i++) {
        total += +srsOriginals[i];
    }
    let avg = (total / srsOriginals.length);

    let c = {
        series: srsOriginals.map(x => {
            console.log(100 - ((avg / x) * 10));
            return 100 - ((avg / x) * 10)
        }),
        options: {
            chart: {
                height: 390,
                type: 'radialBar',
            },
            plotOptions: {
                radialBar: {
                    offsetY: 0,
                    startAngle: 0,
                    endAngle: 270,
                    hollow: {
                        margin: 5,
                        size: '30%',
                        background: 'transparent',
                        image: undefined,
                    },
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            show: false,
                        }
                    }
                }
            },
            labels: routes,
            legend: {
                show: true,
                floating: true,
                fontSize: '16px',
                position: 'left',
                offsetX: 160,
                offsetY: 15,
                labels: {
                    useSeriesColors: true,
                },
                markers: {
                    size: 0
                },
                formatter: function (seriesName, opts) {
                    return 'Weight ' + seriesName + ":  " + (srs[opts.seriesIndex])
                },
                itemMargin: {
                    vertical: 3
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    legend: {
                        show: false
                    }
                }
            }]
        },


    };

    return (
        <div className="col-12 col-lg-6">
            <Chart
                options={c.options}
                series={c.series}
                type="radialBar"
                height="450"
            />
        </div>
    );
};

export default WeightChart;