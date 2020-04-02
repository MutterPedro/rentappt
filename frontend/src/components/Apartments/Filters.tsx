import React from "react";
import { List, Rating, Button, Icon } from "semantic-ui-react";

const Filters = ({
  loading,
  onRate,
  applyFilters
}: {
  loading: boolean;
  onRate: (filter: "size" | "rooms" | "price", rate: number) => void;
  applyFilters: () => void;
}) => (
  <List horizontal size="medium" className="filters">
    <List.Header as="h4">Filters:</List.Header>
    <List.Item>
      <List.Content>Size</List.Content>
      <Rating
        disabled={loading}
        icon="star"
        defaultRating={5}
        maxRating={5}
        onRate={(_evt, { rating }) => onRate("size", Number(rating))}
      />
    </List.Item>
    <List.Item>
      <List.Content>Rooms</List.Content>
      <Rating
        disabled={loading}
        icon="star"
        defaultRating={5}
        maxRating={5}
        onRate={(_evt, { rating }) => onRate("rooms", Number(rating))}
      />
    </List.Item>
    <List.Item>
      <List.Content>Rent Price</List.Content>
      <Rating
        disabled={loading}
        icon="star"
        defaultRating={5}
        maxRating={5}
        onRate={(_evt, { rating }) => onRate("price", Number(rating))}
      />
    </List.Item>
    <List.Item>
      <Button icon basic color="blue" disabled={loading} onClick={applyFilters}>
        <Icon name="filter" />
      </Button>
    </List.Item>
  </List>
);

export default React.memo(Filters);
