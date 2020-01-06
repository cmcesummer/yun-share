export default function IF(props) {
    if (props.strictly) return props.flag !== void 0 && props.flag !== null ? props.children : null;
    return props.flag ? props.children : null;
}
