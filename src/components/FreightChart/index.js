import Chart from "react-apexcharts";

const FreightChart = ({ data }) => {
    let routes = ([...new Set(data.map(x => x.route))]);

    let total = 0;

    let srs = [];

    for (let i = 0; i < routes.length; i++) {
        srs.push(data.filter(f => f.route === routes[i]).reduce((n, { cargo_freight_price_total }) => n + parseFloat(cargo_freight_price_total), 0));
    }


    let srsOriginals = [...srs];

    for (let i = 0; i < srsOriginals.length; i++) {
        total += +srsOriginals[i];
    }
    let avg = (total / srsOriginals.length);

    let c = {
        series: srsOriginals.map(x => {
            return (100 - ((avg / x) * 10)).toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                    return 'Freight ' + seriesName + ":  " + (srs[opts.seriesIndex]).toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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

export default FreightChart;