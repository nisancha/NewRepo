const ManageJobCard = (props) => {
    const {ManageJob} = props;
<Card>
      <Card.Content header='About Amy' />
      <Card.Content description={description} />
      <Card.Content extra>
        <Icon name='user' />4 Friends
      </Card.Content>
    </Card>
}
export default ManageJobCard