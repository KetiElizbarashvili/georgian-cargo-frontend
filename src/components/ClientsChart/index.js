import Chart from "react-apexcharts";

const ClientsChart = ({ clientsRegistered, clientsUsedService, newClients }) => {
    let seriesOriginal = [clientsRegistered, newClients, clientsUsedService];
    let total = 0;
    for (let i = 0; i < seriesOriginal.length; i++) {
        total += seriesOriginal[i];
    }
    let avg = (total / seriesOriginal.length);

    let c = {
        series: [100 - ((avg / clientsRegistered) * 10), 100 - ((avg / newClients) * 10), 100 - ((avg / clientsUsedService) * 10)].map(x => x.toFixed(2)),
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
            colors: ['#0084ff', '#39539E', '#0077B5'],
            labels: ['Registered Clients', 'New Clients', 'Clients Used Service'],
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
                    return seriesName + ":  " + (seriesOriginal[opts.seriesIndex])
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

export default ClientsChart;