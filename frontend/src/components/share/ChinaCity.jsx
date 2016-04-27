import $ from 'jquery';
import React, { PropTypes } from 'react';

const levels = ['省份', '城市', '区县'];

class ChinaCity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: levels.map((x, i) => {
        if (i === 0) return props.list || [];
        return [];
      }),
    };

    this.select = e => {
      const dom = e.target;
      const level = +dom.dataset.level;
      if (level === levels.length - 1 || +dom.value === 0) return;

      $.get(`/china_city/${dom.value}`)
        .done(d => {
          const result = d.data;
          if (!result) return;
          const list = this.state.list.map((x, i) => {
            if (i === level + 1) return result;
            if (i > level + 1) return [];
            return x;
          });
          this.setState({ list });
        })
        .fail(xhr => {
          console.error(xhr);
        });
    };
  }
  render() {
    return (
      <div>
        {
          levels.map((levelName, index) => (
            <select key={index} onChange={this.select} data-level={index}
              name={levels.length - 1 === index ? 'user[location]' : ''}
            >
              <option value="0">{levelName}</option>
              {this.state.list[index].map((x, i) => <option key={i} value={x[1]}>{x[0]}</option>)}
            </select>
          ))
        }
      </div>
    );
  }
}

ChinaCity.propTypes = {
  list: PropTypes.array.isRequired,
};

export default ChinaCity;
