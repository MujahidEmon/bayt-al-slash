import { Chart } from 'react-google-charts'
import PropTypes from 'prop-types'
// export const data = [
//   ['Day', 'Sales'],
//   ['9', 1000],
//   ['10', 1170],
//   ['11', 660],
//   ['12', 1030],
// ]
 const options = {
  title: 'Sales Over Time',
  curveType: 'function',
  legend: { position: 'bottom' },
  series: [{ color: '#F43F5E' }],
}
const SalesLineChart = ({data}) => {
  return (
    data.length <=1 ? <p className='text-center my-4'>No sales data found</p> :
    <Chart chartType='LineChart' width='100%' data={data} options={options} />
  )
}

SalesLineChart.propTypes = {
  data: PropTypes.array
}

export default SalesLineChart