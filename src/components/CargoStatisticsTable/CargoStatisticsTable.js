import React, { useContext, useEffect, useState } from "react";
import "./CargoStatisticsTable.css"
import { AuthContext } from "../../context";
import Chart from "react-apexcharts";
import { currency_symbols } from "../../utils/Currency";
import { month_names } from "../../utils/MonthNames";

// const initFilter = { status: "", agent: "", route: "", datefrom: "", dateto: "", paymentmethod: "", paymentstatus: "", collection: "", interval: "month" };

function CargoStatisticsTable({ filter, setFilter, statisticsData, type }) {
  // console.log(statisticsData);
  const { auth, setAuth } = useContext(AuthContext);
  const token = auth.accessToken;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dataCategories, setDataCategories] = useState([]);
  const [dataTitles, setTitles] = useState([]);
  const [seriesData, setSeriesData] = useState([]);

  const [finished, setFinished] = useState([]);
  const { auth: { routes, accountType, accountId } } = useContext(AuthContext);

  let dat = [];
  let datCategories = [];
  const [years, setYears] = useState([]);
  const [trees, setTrees] = useState([]);
  const [areas, setAreas] = useState([]);
  const [pies, setPies] = useState([]);
  const [columns, setColumns] = useState([]);
  const [stacked, setStacked] = useState([]);

  function removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
    })
  }


  useEffect(() => {
    let yrs = [];
    let trs = [];
    let ars = [];
    let ps = [];
    let cs = [];
    let sc = [];
    let datCategories = [];
    let datCategoriesTemp = [];
    let dts = [];
    if (Object.keys(data).length !== 0) {
      for (let cat in data) {

        data[cat].map(c => {
          let dd = c.day === undefined ? "" : c.day;
          let ww = c.week === undefined ? "" : "- week" + (c.week + 1);
          let mm = c.month === undefined ? "" : c.month;
          let element = c.year + " - " + dd + month_names(mm) + " " + ww;
          if (!Array.isArray(datCategoriesTemp[c.currency])) {
            datCategoriesTemp[cat] = [];
          }
          datCategoriesTemp[cat].push({ currency: cat, data: element });
        });

        datCategories[cat] = removeDuplicates(datCategoriesTemp[cat], 'data')

        dts[cat] = Object.values(data[cat].reduce((acc, { cargo_delivery_price_total, cargo_freight_price_total, cargo_packaging_price_total, cargo_discount_total, cargo_extra, cargo_weight, cargo_total_price, total_parcels, currency, year, month, week, day, route }) => {
          const key = currency + year + '' + (month ? month : '') + (week ? week : '') + (day ? day : '');
          // console.log(key);
          // acc[key] = acc[key] || { cargo_delivery_price_total, cargo_freight_price_total, cargo_packaging_price_total, cargo_discount_total, cargo_extra, cargo_weight, cargo_total_price, total_parcels, currency, year, month, week, day, route };
          if (undefined === acc[key]) {
            acc[key] = { cargo_delivery_price_total, cargo_freight_price_total, cargo_packaging_price_total, cargo_discount_total, cargo_extra, cargo_weight, cargo_total_price, total_parcels, currency, year, month, week, day, route };
          } else {
            acc[key].cargo_delivery_price_total += cargo_delivery_price_total;
            acc[key].cargo_freight_price_total += cargo_freight_price_total;
            acc[key].cargo_packaging_price_total += cargo_packaging_price_total;
            acc[key].cargo_discount_total += cargo_discount_total;
            acc[key].cargo_extra += cargo_extra;
            acc[key].cargo_weight += cargo_weight;
            acc[key].cargo_total_price += cargo_total_price;
            acc[key].total_parcels += total_parcels;
          }

          return acc;
        }, {}));


        // console.log(datCategories[cat].length, dts[cat].length);
        cs.push(JSON.parse(JSON.stringify(
          {

            series: [{
              name: 'Weight',
              data: dts[cat].map(x => x.cargo_weight)
            }, {
              name: 'Freight',
              data: dts[cat].map(x => x.cargo_freight_price_total.toFixed(2))
            }, {
              name: 'Parcels',
              data: dts[cat].map(x => x.total_parcels)
            }],

            options: {
              tooltip: {
                y: {
                  formatter: function (val) {
                    return currency_symbols(cat) + val
                  }
                }
              },
              chart: {
                type: 'bar',
                height: 650
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: '80%',
                  endingShape: 'rounded'
                },
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                show: true,
                width: 1,
                colors: ['transparent']
              },
              xaxis: {
                categories: datCategories[cat].map(e => e.data),
              },
              yaxis: {
                title: {
                  text: cat
                }
              },
              fill: {
                opacity: 1
              },

            },


          }
        )));

        setColumns(cs);


        console.log();
        sc.push(JSON.parse(JSON.stringify(
          {

            series: [{
              name: 'Freight',
              data: dts[cat].map(x => x.cargo_freight_price_total)
            }, {
              name: 'Delivery',
              data: dts[cat].map(x => x.cargo_delivery_price_total)
            }, {
              name: 'Extra',
              data: dts[cat].map(x => x.cargo_extra)
            }, {
              name: 'Packaging',
              data: dts[cat].map(x => x.cargo_packaging_price_total)
            }, {
              name: 'Weight',
              data: dts[cat].map(x => x.cargo_weight)
            }, {
              name: 'Parcels',
              data: dts[cat].map(x => x.total_parcels)
            }],
            options: {
              chart: {
                type: 'bar',
                height: 350,
                stacked: true,
                stackType: '100%'
              },
              responsive: [{
                breakpoint: 480,
                options: {
                  legend: {
                    position: 'bottom',
                    offsetX: -10,
                    offsetY: 0
                  }
                }
              }],
              xaxis: {
                categories: datCategories[cat].map(e => e.data),
              },
              fill: {
                opacity: 1
              },
              legend: {
                position: 'right',
                offsetX: 0,
                offsetY: 50
              },
            },


          }
        )));

        setStacked(sc);

        trs.push(JSON.parse(JSON.stringify({
          currency: cat,
          series: [
            {
              data: [
                {
                  x: "Freight Price",
                  y: dts[cat].reduce((n, { cargo_freight_price_total }) => n + cargo_freight_price_total, 0).toFixed(2)
                },
                {
                  x: "Packaging Price",
                  y: dts[cat].reduce((n, { cargo_packaging_price_total }) => n + cargo_packaging_price_total, 0).toFixed(2)
                },
                {
                  x: "Delivery Price",
                  y: dts[cat].reduce((n, { cargo_delivery_price_total }) => n + cargo_delivery_price_total, 0).toFixed(2)
                },
                {
                  x: "Extra Charges",
                  y: dts[cat].reduce((n, { cargo_extra }) => n + cargo_extra, 0).toFixed(2)
                },
                {
                  x: "Weight",
                  y: dts[cat].reduce((n, { cargo_weight }) => n + cargo_weight, 0).toFixed(2)
                },
                {
                  x: "Parcels Count",
                  y: dts[cat].reduce((n, { total_parcels }) => n + total_parcels, 0).toFixed(2)
                },
              ]
            }
          ],
          title: {
            text: currency_symbols(cat) + dts[cat].reduce((n, { cargo_total_price }) => n + cargo_total_price, 0).toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            align: 'center'
          },
          options: {
            legend: {
              show: false
            },
            chart: {
              height: 350,
              type: 'treemap'
            },
            colors: [
              '#3B93A5',
              '#F7B844',
              '#ADD8C7',
              '#EC3C65',
              '#CDD7B6',
              '#C1F666',
              '#D43F97',
              '#1E5D8C',
              '#421243',
              '#7F94B0',
              '#EF6537',
              '#C0ADDB'
            ],
          },
          plotOptions: {
            treemap: {
              distributed: true,
              enableShades: false
            }
          },
        })));
        setTrees(trs);

        yrs.push(JSON.parse(JSON.stringify({
          currency: cat,
          series: [],
          chart: {
            type: "line",
            height: 550,
            zoom: {
              enabled: false,
            },
            events: {
              markerClick: function (
                event,
                chartContext,
                { seriesIndex, dataPointIndex, config }
              ) {
                // redirectToMonth();
                // console.log(seriesIndex + 1, dataPointIndex + 1);
                // var year = parseInt(years.find(yx => yx.currency === cat).xaxis.categories[dataPointIndex]);
                // var month =
                //   dataPointIndex + 1 == 12 ? 12 : (dataPointIndex % 12) + 1;
                // console.log(year); //////////////////////
              },
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function (value) {
              value = value || 0.0;
              var symb = currency_symbols(cat);
              var val = value
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              return val;
            },
          },
          stroke: {
            curve: "smooth",
          },
          fill: {
            opacity: 0.3,
          },
          yaxis: {
            min: 0,
            labels: {
              formatter: function (value) {
                value = value || 0.0;
                var symb = currency_symbols(cat);
                var val = value
                  .toFixed(2)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return val;
              },
            },
          },
          xaxis: {
            categories: datCategories[cat].map(e => e.data),
            type: 'string'
          },
          theme: {
            mode: "light",
            palette: "palette2",
            monochrome: {
              enabled: false,
              color: "#255aee",
              shadeTo: "light",
              shadeIntensity: 0.65,
            },
          },
          title: {
            text: currency_symbols(cat) + dts[cat].reduce((n, { cargo_total_price }) => n + cargo_total_price, 0).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            offsetX: 0,
            style: {
              fontSize: "24px",
            },
          },
          subtitle: {
            text: "Total price for " + currency_symbols(cat),
            offsetX: 0,
            style: {
              fontSize: "14px",
            },
          },
          grid: {
            padding: {
              left: 50,
              right: 50,
            },
          },
        })))
        ars.push({
          currency: cat,
          series: [{
            name: "Freight Price",
            data: dts[cat].map(x => x.cargo_freight_price_total)
          }, {
            name: "Packaging Price",
            data: dts[cat].map(x => x.cargo_packaging_price_total)
          }, {
            name: "Delivery Price",
            data: dts[cat].map(x => x.cargo_delivery_price_total)
          }, {
            name: "Extra charges",
            data: dts[cat].map(x => x.cargo_extra)
          }, {
            name: "Weight",
            data: dts[cat].map(x => x.cargo_weight)
          }, {
            name: "Total Parcels",
            data: dts[cat].map(x => x.total_parcels)
          }],
          dataLabels: {
            enabled: false
          },
          xaxis: {
            type: 'string',
            categories: datCategories[cat].map(e => e.data)
          },
          yaxis: {
            opposite: false
          },
          options: {
            chart: {
              type: 'area',
              height: 350,
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth'
            },

            title: {
              text: 'Fundamental Analysis of Stocks',
              align: 'left'
            },
            subtitle: {
              text: 'Price Movements',
              align: 'left'
            },
            labels: [],
            legend: {
              horizontalAlign: 'left'
            }
          },


        });

        ps.push({

          series: [Math.round(dts[cat].reduce((n, { cargo_freight_price_total }) => n + cargo_freight_price_total, 0))
            , Math.round(dts[cat].reduce((n, { cargo_packaging_price_total }) => n + cargo_packaging_price_total, 0)),
          Math.round(dts[cat].reduce((n, { cargo_delivery_price_total }) => n + cargo_delivery_price_total, 0)),
          Math.round(dts[cat].reduce((n, { cargo_extra }) => n + cargo_extra, 0))],
          labels: [`Freight ${currency_symbols(cat)}`, `Packaging ${currency_symbols(cat)}`, `Delivery ${currency_symbols(cat)}`, `Extra charges ${currency_symbols(cat)}`],
          options: {
            chart: {
              width: 380,
              type: 'pie',
            },
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          },


        });
      }
    }
    setPies(ps);
    setAreas(ars);
    setYears(yrs);
  }, [data]);

  useEffect(() => {

    let currencies = [...new Set(statisticsData.map(c => c.currency))];

    currencies.map((cur, i) => {
      dat[cur] = statisticsData.filter(f => f.currency === cur);
    });

    setData(dat);


    var gbpFound = statisticsData.find((element) => {
      return element.currency === "GBP";
    })
    if (gbpFound == null) {
      console.log("no gbp found");
    }

    var eurFound = statisticsData.find((element) => {
      return element.currency === "EUR";
    })
    if (eurFound == null) {
      console.log("no eur found");
    }

  }, [statisticsData]);

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      for (let cat in data) {
        data[cat].map(c => {
          let dd = c.day === undefined ? "" : c.day;
          let ww = c.week === undefined ? "" : "- week" + (c.week + 1);
          let mm = c.month === undefined ? "" : c.month;
          let element = c.year + " - " + dd + month_names(mm) + " " + ww;
          if (!Array.isArray(datCategories[c.currency])) {
            datCategories[c.currency] = [];
          }
          datCategories[cat].push({ currency: cat, data: element });
        });
      }
    }

    setDataCategories(datCategories);
  }, [data]);

  useEffect(() => {
    setDataForApex();
  }, [dataCategories]);



  useEffect(() => {
    let yrs = [...years];
    if (Object.keys(yrs).length !== 0) {
      yrs.map((y, i) => {
        // yrs[i].xaxis.categories = dataCategories.filter(w => w.currency === y.currency).map(e => e.data);
      });
    }
    // setYears(yrs);
  }, [dataCategories]);

  useEffect(() => {
    let yrs = [...years];
    if (Object.keys(seriesData).length !== 0) {
      for (let y in seriesData) {
        yrs.find(x => x.currency === y).series = seriesData[y];
      }
    }
    setYears(yrs);
  }, [seriesData]);

  useEffect(() => {
    // console.log(years);
  }, [years]);

  const setDataForApex = () => {
    var cargoPriceTotals = [];
    var cargoFreightPriceTotals = [];
    var cargoDeliveryTriceTotals = [];
    var cargoDiscountTotals = [];
    var cargoExtraChargeTotals = [];
    var cargoPackagingPriceTotals = [];
    var cargoWeightsTotals = [];
    var cargoCountsTotals = [];
    var cargoTotalPrice = [];

    [...new Set(statisticsData.map(c => c.currency))].map(c => {
      cargoPriceTotals[c] = [];
      cargoFreightPriceTotals[c] = [];
      cargoDeliveryTriceTotals[c] = [];
      cargoDiscountTotals[c] = [];
      cargoExtraChargeTotals[c] = [];
      cargoPackagingPriceTotals[c] = [];
      cargoWeightsTotals[c] = [];
      cargoCountsTotals[c] = [];
      cargoTotalPrice[c] = 0;
    });

    if (Object.keys(data).length !== 0) {

      var cargoPriceTotal = [];
      var cargo_freight_price_total = [];
      var cargo_weight_total = [];
      var cargo_delivery_price_total = [];
      var cargo_discount_total = [];
      var cargo_parcels_total = [];
      var cargo_extra_charge_total = [];
      var cargo_packaging_price_total = [];



      for (let cat in data) {
        Object.values(data[cat].reduce((acc, { cargo_delivery_price_total, cargo_freight_price_total, cargo_packaging_price_total, cargo_discount_total, cargo_extra, cargo_weight, cargo_total_price, total_parcels, currency, year, month, week, day, route }) => {
          const key = currency + year + '' + (month ? month : '') + (week ? week : '') + (day ? day : '');
          // console.log(key);
          // acc[key] = acc[key] || { cargo_delivery_price_total, cargo_freight_price_total, cargo_packaging_price_total, cargo_discount_total, cargo_extra, cargo_weight, cargo_total_price, total_parcels, currency, year, month, week, day, route };
          if (undefined === acc[key]) {
            acc[key] = { cargo_delivery_price_total, cargo_freight_price_total, cargo_packaging_price_total, cargo_discount_total, cargo_extra, cargo_weight, cargo_total_price, total_parcels, currency, year, month, week, day, route };
          } else {
            acc[key].cargo_delivery_price_total += cargo_delivery_price_total;
            acc[key].cargo_freight_price_total += cargo_freight_price_total;
            acc[key].cargo_packaging_price_total += cargo_packaging_price_total;
            acc[key].cargo_discount_total += cargo_discount_total;
            acc[key].cargo_extra += cargo_extra;
            acc[key].cargo_weight += cargo_weight;
            acc[key].cargo_total_price += cargo_total_price;
            acc[key].total_parcels += total_parcels;
          }

          return acc;
        }, {})).map(c => {
          cargoTotalPrice[cat] += c.cargo_total_price;

          cargoPriceTotals[cat].push(
            c.cargo_total_price.toFixed(2)
          );
          cargoFreightPriceTotals[cat].push(
            c.cargo_freight_price_total.toFixed(2)
          );
          cargoDeliveryTriceTotals[cat].push(
            c.cargo_delivery_price_total.toFixed(2)
          );
          cargoDiscountTotals[cat].push(
            c.cargo_discount_total.toFixed(2)
          );
          cargoExtraChargeTotals[cat].push(
            c.cargo_extra.toFixed(2)
          );
          cargoPackagingPriceTotals[cat].push(
            c.cargo_packaging_price_total.toFixed(2)
          );
          cargoWeightsTotals[cat].push(
            c.cargo_weight.toFixed(2)
          );
          cargoCountsTotals[cat].push(
            c.total_parcels.toFixed(2)
          );
        });

        years.map((y, i) => {
          years[i].title.text = "Asfds";
        });
        // temp.title.text =
        //   currency_symbols(cat) +
        //   cargoTotalPrice[cat]
        //     .toFixed(2)
        //     .toString()
        //     .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // console.log(yrs);
        // console.log(yrs);
        // setYears(yrs);

        cargoPriceTotal[cat] = {
          name:
            "Total price" + "(<b>" + currency_symbols(cat) + "</b>)",
          data: cargoPriceTotals[cat],
        };

        cargo_freight_price_total[cat] = {
          name:
            "Total freight price" +
            "(<b>" +
            currency_symbols(cat) +
            "</b>)",
          data: cargoFreightPriceTotals[cat],
        };
        cargo_weight_total[cat] = {
          name: "Total weight",
          data: cargoWeightsTotals[cat],
        };
        cargo_delivery_price_total[cat] = {
          name:
            "Cargo delivery price total" +
            "(<b>" +
            currency_symbols(cat) +
            "</b>)",
          data: cargoDeliveryTriceTotals[cat],
        };

        cargo_discount_total[cat] = {
          name:
            "Cargo discount price total" +
            "(<b>" +
            currency_symbols(cat) +
            "</b>)",
          data: cargoDiscountTotals[cat],
        };

        cargo_parcels_total[cat] = {
          name: "Cargo parcels count",
          data: cargoCountsTotals[cat],
        };

        cargo_extra_charge_total[cat] = {
          name:
            "Cargo extra charge total" +
            "(<b>" +
            currency_symbols(cat) +
            "</b>)",
          data: cargoExtraChargeTotals[cat],
        };

        cargo_packaging_price_total[cat] = {
          name:
            "Cargo packaging  total" +
            "(<b>" +
            currency_symbols(cat) +
            "</b>)",
          data: cargoPackagingPriceTotals[cat],
        };

      }
    }


    let srs = [];
    if (Object.keys(data).length !== 0) {
      // Object.values(data[cat].reduce((acc, { cargo_delivery_price_total, cargo_freight_price_total, cargo_packaging_price_total, cargo_discount_total, cargo_extra, cargo_weight, cargo_total_price, total_parcels, currency, year, month, week, day, route }) => {
      //   const key = currency + year + '' + (month ? month : '') + (week ? week : '') + (day ? day : '');
      //   // console.log(key);
      //   // acc[key] = acc[key] || { cargo_delivery_price_total, cargo_freight_price_total, cargo_packaging_price_total, cargo_discount_total, cargo_extra, cargo_weight, cargo_total_price, total_parcels, currency, year, month, week, day, route };
      //   if (undefined === acc[key]) {
      //     acc[key] = { cargo_delivery_price_total, cargo_freight_price_total, cargo_packaging_price_total, cargo_discount_total, cargo_extra, cargo_weight, cargo_total_price, total_parcels, currency, year, month, week, day, route };
      //   } else {
      //     acc[key].cargo_delivery_price_total += cargo_delivery_price_total;
      //     acc[key].cargo_freight_price_total += cargo_freight_price_total;
      //     acc[key].cargo_packaging_price_total += cargo_packaging_price_total;
      //     acc[key].cargo_discount_total += cargo_discount_total;
      //     acc[key].cargo_extra += cargo_extra;
      //     acc[key].cargo_weight += cargo_weight;
      //     acc[key].cargo_total_price += cargo_total_price;
      //     acc[key].total_parcels += total_parcels;
      //   }

      //   return acc;
      // }, {}))

      for (let cat in data) {
        if (data[cat].length !== 0) {
          srs[cat] = [cargoPriceTotal[cat],
          cargo_freight_price_total[cat],
          cargo_delivery_price_total[cat],
          cargo_extra_charge_total[cat],
          cargo_packaging_price_total[cat],
          cargo_discount_total[cat],
          cargo_parcels_total[cat],
          cargo_weight_total[cat]];
        }
        else {
          years[cat].title.text = "No data found.";
        }
      }

      setSeriesData(srs);
      setFinished(true);
    }
    setLoading(false);
  };

  return (
    <>
      {loading &&
        <>
          <style>{`
    .spinner-border {
      width: 4rem; height: 4rem;
    }
      `}
          </style>
          <center>
            <div class="m-4 spinner-border text-warning" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </center>
        </>
      }
      <>
        {type === 'line' && years && (
          <div className="row graph-block">
            {finished && Object.keys(years).length > 0 && (
              Object.keys(data).map((c, i) => (
                <div className="col-12 col-lg-6 p-3" key={i}>
                  {years.find(f => f.currency === c) && (
                    <Chart
                      options={years.find(f => f.currency === c)}
                      series={years.find(f => f.currency === c).series}
                      type="line"
                      height="450"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        )}
        {type === 'treemap' && (
          <div className="row graph-block">
            {finished && Object.keys(trees).length > 0 && (
              trees && trees.map((c, i) => (
                <div className="col-12 col-lg-6 p-3" key={i}>
                  <Chart
                    options={c}
                    series={c.series}
                    type="treemap"
                    height="450"
                  />
                </div>
              ))
            )}
          </div>
        )}
        {type === 'area' && (
          <div className="row graph-block">
            {finished && Object.keys(pies).length > 0 && (
              pies && pies.map((cl, i) => (
                <div className="col-12 col-lg-6 p-3" key={i}>
                  <Chart
                    options={cl}
                    series={cl.series}
                    type="pie"
                    height="450"
                  />
                </div>
              ))
            )}
          </div>
        )}

        {type === 'columns' && (
          <div className="row graph-block">
            {finished && Object.keys(columns).length > 0 && (
              columns && columns.map((cl, i) => (
                <div className="col-12 p-3" key={i}>
                  <Chart
                    options={cl.options}
                    series={cl.series}
                    type="bar"
                    height="650"
                  />
                </div>
              ))
            )}
          </div>
        )}

        {type === 'stacked' && (
          <div className="row graph-block">
            {finished && Object.keys(stacked).length > 0 && (
              stacked && stacked.map((cl, i) => (
                <div className="col-12 p-3" key={i}>
                  <Chart
                    options={cl.options}
                    series={cl.series}
                    type="bar"
                    height="450"
                  />
                </div>
              ))
            )}
          </div>
        )}
      </>
    </>
  );
}

export default CargoStatisticsTable;

