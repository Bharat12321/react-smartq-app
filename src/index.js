// Import modules
import React from 'react'
import ReactDOM from 'react-dom'
import SmartDataTable from 'react-smart-data-table'

const sematicUI = {
  segment: 'ui basic segment',
  message: 'ui message',
  input: 'ui icon input',
  searchIcon: 'search icon',
  rowsIcon: 'numbered list icon',
  table: 'ui compact selectable table',
  select: 'ui dropdown',
  refresh: 'ui labeled primary icon button',
  refreshIcon: 'sync alternate icon',
  change: 'ui labeled secondary icon button',
  changeIcon: 'exchange icon',
  checkbox: 'ui toggle checkbox',
  loader: 'ui active text loader',
  deleteIcon: 'trash red icon',
}

const apiDataUrls = [
  'http://127.0.0.1:3001/v1/restaurants',
]

const generateData = (numResults = 0) => {
  let total = numResults || 0
  if (typeof numResults === 'string') {
    total = parseInt(numResults, 10)
  }
  const data = []
  return data
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      useApi: false,
      apiData: '',
      apiIdx: -1,
      numResults: 10,
      data: [],
      filterValue: '',
      perPage: 0,
    }

    this.setNewData = this.setNewData.bind(this)
    this.changeData = this.changeData.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnPerPage = this.handleOnPerPage.bind(this)
  }

  componentDidMount() {
    const { numResults } = this.state
    fetch("http://127.0.0.1:3001/v1/restaurants")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            data: result
          });
        },
        (error) => {
          console.log(error, "error")
        }
      )
    this.setNewData(numResults)
  }

  setNewData() {
    const { numResults } = this.state
    this.setState({
      data: generateData(numResults),
    })
  }

  handleOnChange({ target: { name, value } }) {
    this.setState({ [name]: value }, () => {
      if (name === 'numResults') this.setNewData()
    })
  }

  handleOnPerPage({ target: { name, value } }) {
    this.setState({ [name]: parseInt(value, 10) })
  }

  changeData() {
    const { useApi } = this.state
    this.setState({
      useApi: !useApi,
      filterValue: '',
      perPage: 0,
    })
  }


  render() {
    const {
      useApi, apiData, data, filterValue, perPage, numResults,
    } = this.state
    const divider = <span style={{ display: 'inline-block', margin: '10px' }} />

    return (
      <div>
        <div className={sematicUI.segment}>
          <div className={sematicUI.input}>
            <input
              type='text'
              name='filterValue'
              value={filterValue}
              placeholder='Filter results...'
              onChange={this.handleOnChange}
            />
            <i className={sematicUI.searchIcon} />
          <select
            name='perPage'
            value={perPage}
            className={sematicUI.select}
            onChange={this.handleOnPerPage}
          >
            <option value='0'> Per Page </option>
            <option value='10'> 10 </option>
            <option value='25'> 25 </option>
            <option value='50'> 50 </option>
            <option value='100'> 100 </option>
          </select>
          </div>
          {!useApi && (
            <span>
              {divider}
              <div className={sematicUI.input}>
                <input
                  type='text'
                  name='numResults'
                  value={numResults}
                  placeholder='# Rows'
                  onChange={this.handleOnChange}
                  style={{ width: '60px' }}
                />
                <i className={sematicUI.rowsIcon} />
              </div>
            </span>
          )}
          {divider}

        </div>
        <div className={sematicUI.message}>
          <p>
            {useApi
              ? 'While using async data, the state is controlled internally by the table'
              : `Total rows in the table: ${data.length}`}
          </p>
        </div>

        <div style={{ margin: '30px', 'border-style': 'solid' }}>
        <SmartDataTable
          data={useApi ? apiData : data}
          dataKey=''
          name='test-table'
          className={sematicUI.table}
          filterValue={filterValue}
          perPage={perPage}
          sortable
          withToggles
          withLinks
          withHeader
          loader={(
            <div className={sematicUI.loader}>
              Loading...
            </div>
          )}
          parseBool={{
            yesWord: 'Indeed',
            noWord: 'Nope',
          }}
          parseImg={{
            style: {
              border: '1px solid #ddd',
              borderRadius: '2px',
              padding: '3px',
              width: '60px',
            },
          }}
          dynamic
          emptyTable={(
            <div className={sematicUI.message}>
              There is no data available to display.
            </div>
          )}
        />
        </div>


      </div>
    )
  }
}


ReactDOM.render(
  <App />,
  document.getElementById('root'),
)