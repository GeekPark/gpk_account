import $ from 'jquery';
import React, { PropTypes } from 'react';

const levels = ['省份', '城市', '区县'];

class ChinaCity extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: props.selected || undefined,
      list: levels.map((x, i) => {
        if (i === 0) return props.list || [];
        return [];
      }),
    };

    this.select = e => {
      const dom = e.target;
      const level = +dom.dataset.level;
      if (level === levels.length - 1 || +dom.value === 0) return;

      this.getList(dom.value, result => {
        const list = this.state.list.map((x, i) => {
          if (i === level + 1) return result;
          if (i > level + 1) return [];
          return x;
        });
        this.setState({ list });
      });
    };
  }

  componentDidMount() {
    const { selected } = this.state;
    if (!selected) return;
    const result = [
      `${selected.substring(0, 3)}000`,
      `${selected.substring(0, 4)}00`,
      selected,
    ];
    this.getList(result[0], d => {
      this.getList(result[1], x => {
        const list = this.state.list.map((y, i) => {
          if (i === 1) return d;
          if (i === 2) return x;
          return y;
        });

        this.setState({ list });
        result.forEach((val, index) => {
          this.refs[`select${index}`].value = val;
        });
      });
    });
  }

  getList(id, cb) {
    $.get(`/china_city/${id}`)
      .done(d => {
        if (d.data) cb(d.data);
      })
      .fail(xhr => {
        console.error(xhr);
      });
  }

  render() {
    return (
      <div>
        {
          levels.map((levelName, index) => (
            <select key={index} onChange={this.select} data-level={index}
              name={levels.length - 1 === index ? 'user[location]' : ''}
              ref={`select${index}`}
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
  selected: PropTypes.string,
};

export default ChinaCity;
