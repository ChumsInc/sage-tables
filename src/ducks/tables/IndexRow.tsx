export interface IndexListProps {
    name: string;
    unique: boolean;
    fields: string[]
}
const IndexRow = ({name, fields = []}:IndexListProps) => {
    return (
        <tr>
            <td><code className="me-3"><strong>{name}</strong></code></td>
            <td><code>{fields.join(', ')}</code></td>
        </tr>
    )
};

export default IndexRow;
